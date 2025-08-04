import { defineConfig } from 'vite'
import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/cbt4cert/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    port: 5173,
    host: true
  },
  plugins: [
    {
      name: 'copy-static-assets',
      writeBundle() {
        // data 폴더 복사
        const copyDir = (src, dest) => {
          if (!existsSync(src)) return
          if (!existsSync(dest)) {
            mkdirSync(dest, { recursive: true })
          }
          const items = readdirSync(src)
          for (const item of items) {
            const srcPath = join(src, item)
            const destPath = join(dest, item)
            const stat = statSync(srcPath)
            if (stat.isDirectory()) {
              copyDir(srcPath, destPath)
            } else {
              copyFileSync(srcPath, destPath)
            }
          }
        }
        
        // data 폴더 복사
        copyDir('data', 'dist/data')
        
        // assets/images 폴더 복사
        copyDir('assets/images', 'dist/assets/images')
        
        console.log('Static assets copied to dist/')
      }
    }
  ]
})
