// vue.config.js
module.exports = {
  publicPath: process.env.VUE_APP_ENV === 'production' ? 'https://f.taikang.com/static/yunying/orderRequire' : './',
  outputDir: 'vueTemplate',
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  // 生产环境不需要生成 sourceMap 文件，以加速构建
  productionSourceMap: false,
  devServer: { // 代理解决跨域问题
    proxy: {
      '/preservation': {
        target: 'https://sspuat.taikang.com',
        changeOrigin: true
      }
    }
  }
}
