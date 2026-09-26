const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000/monopoly',
        changeOrigin: true
      },
      '/ws/game': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true
      },
      '/ws/gm': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true
      }
    }
  }
})
