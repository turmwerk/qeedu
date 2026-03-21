import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dns from 'dns' // 【新增】：引入 Node.js 内置的 dns 模块

// 【新增】：强制 Node.js 在解析 localhost 时优先使用 IPv4
dns.setDefaultResultOrder('ipv4first')

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true,
      },
    },
  },

  optimizeDeps: {
    include: [
      'style-to-js',
    ],
  },
})
