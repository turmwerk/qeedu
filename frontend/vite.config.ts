import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // 关键配置
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    // 强制将某些 CJS 包预打包，确保 default 导出兼容（避免运行时 "does not provide an export named 'default'"）
    include: [
      'style-to-js',
    ],
  },
})