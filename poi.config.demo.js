module.exports = (options, req) => ({
  extractCSS: false,
  sourceMap: false,
  removeDist: true,
  dist: 'docs',
  homepage: '/v-file-upload/',
  html: {
    template: './demo/index.html'
  }
})
