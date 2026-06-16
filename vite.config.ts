import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    rollupOptions: {
      output: {
        // Split large, stable vendor libraries into their own chunks so they
        // cache independently and don't block first paint of the app code.
        manualChunks(id) {
          if (!id.includes('/node_modules/')) return
          // Match on the package boundary so scoped packages like
          // `@tiptap/react` don't get mis-bucketed into `react`.
          if (/\/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) return 'react'
          if (/\/node_modules\/(motion|framer-motion)\//.test(id)) return 'motion'
          if (id.includes('/node_modules/@radix-ui/')) return 'radix'
          if (id.includes('/node_modules/@supabase/')) return 'supabase'
          if (id.includes('/node_modules/@tiptap/') || id.includes('/node_modules/prosemirror')) return 'tiptap'
        },
      },
    },
  },
})
