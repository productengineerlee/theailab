import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 벤더 라이브러리를 별도 청크로 분리
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react'],
        },
      },
    },
    // 청크 사이즈 경고 임계값 조정
    chunkSizeWarningLimit: 1000,
    // 소스맵 비활성화로 빌드 속도 향상
    sourcemap: false,
  },
  // 개발 서버 최적화
  server: {
    hmr: {
      overlay: true,
    },
  },
})