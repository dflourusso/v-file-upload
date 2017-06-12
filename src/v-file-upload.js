// need to use require instead of import (changes from babel 5 to 6)
const FileUpload = require('./FileUpload.vue')
const FileUploadService = require('./FileUpload.js')

FileUpload.install = vue => vue.component('file-upload', FileUpload)
FileUpload.version = proccess.env.VERSION

module.exports = { FileUpload, FileUploadService }
