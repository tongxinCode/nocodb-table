import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  server: {
    port: 5173, // 修改端口号，默认是5173
    proxy: {
      // 配置代理，一般在开发环境和后端联调时使用
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        // 不重写路径，保留/api前缀
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  base: "/", // 配置基础路径，默认为
  define: {
    // 配置全局变量
    APP_VERSION: JSON.stringify("0.0.0.1"),
  },
  publicDir: "public", // 配置静态文件目录，默认为public
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: { api: 'modern-compiler' },
    }
  }
})
