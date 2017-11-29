module.exports = (options, req) => ({
  extractCSS: false,
  html: false,
  sourceMap: false,
  format: 'cjs',
  filename: {
    js: 'v-file-upload.js'
  },
  hash: false,
  removeDist: true
})
