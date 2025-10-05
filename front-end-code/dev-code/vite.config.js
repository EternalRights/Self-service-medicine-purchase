import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 确保 Vue 3 兼容性
          isCustomElement: tag => tag.startsWith('vue-')
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // 关键修复：确保 vue-demi 使用正确的 Vue 3 入口
      'vue-demi': fileURLToPath(
        new URL('./node_modules/vue-demi/lib/v3/index.mjs', import.meta.url)
      )
    }
  },
  optimizeDeps: {
    // 排除 vue-demi 避免预构建问题
    exclude: ['vue-demi']
  },
  define: {
    // 确保全局 Vue 引用正确
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false
  }
})