import { createReadStream, promises as fs } from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist')
const port = Number(process.env.WEB_PORT || 80)
const apiUpstream = new URL(process.env.API_UPSTREAM || 'http://gateway:8080')

const contentTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.svg', 'image/svg+xml'],
  ['.ico', 'image/x-icon'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
  ['.ttf', 'font/ttf'],
])

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers)
  res.end(body)
}

function proxy(req, res) {
  const target = new URL(req.url || '/', apiUpstream)
  const headers = { ...req.headers, host: apiUpstream.host }
  const proxyReq = http.request(
    target,
    {
      method: req.method,
      headers,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 502, proxyRes.headers)
      proxyRes.pipe(res)
    },
  )

  proxyReq.on('error', (error) => {
    send(res, 502, `Bad gateway: ${error.message}\n`, {
      'content-type': 'text/plain; charset=utf-8',
    })
  })

  req.pipe(proxyReq)
}

async function serveFile(req, res) {
  const rawUrl = new URL(req.url || '/', 'http://localhost')
  let pathname = decodeURIComponent(rawUrl.pathname)
  if (pathname === '/health') {
    send(res, 200, 'OK\n', { 'content-type': 'text/plain; charset=utf-8' })
    return
  }

  if (pathname.startsWith('/api/') || pathname.startsWith('/uploads/')) {
    proxy(req, res)
    return
  }

  if (pathname.endsWith('/')) {
    pathname += 'index.html'
  }

  const candidate = path.normalize(path.join(rootDir, pathname))
  const safePath = candidate.startsWith(rootDir) ? candidate : path.join(rootDir, 'index.html')

  try {
    const stat = await fs.stat(safePath)
    if (!stat.isFile()) {
      throw new Error('not a file')
    }
    const ext = path.extname(safePath)
    res.writeHead(200, {
      'content-type': contentTypes.get(ext) || 'application/octet-stream',
    })
    createReadStream(safePath).pipe(res)
  } catch {
    const indexPath = path.join(rootDir, 'index.html')
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
    createReadStream(indexPath).pipe(res)
  }
}

http.createServer((req, res) => {
  serveFile(req, res).catch((error) => {
    send(res, 500, `Internal server error: ${error.message}\n`, {
      'content-type': 'text/plain; charset=utf-8',
    })
  })
}).listen(port, '0.0.0.0', () => {
  console.log(`[qeedu-web] listening on :${port}, proxy=${apiUpstream.origin}`)
})
