exports.warn = function () {
  console.warn('\x1b[33m[hexo-editor-server]', ...arguments)
}
exports.error = function () {
  console.error('\x1b[31m[hexo-editor-server]', ...arguments)
}
