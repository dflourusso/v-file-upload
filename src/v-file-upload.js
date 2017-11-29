// need to use require instead of import (changes from babel 5 to 6)
import FileUpload from './FileUpload.vue'
import FileUploadService from './FileUpload.js'

export { FileUploadService }

export default {
  ...FileUpload,
  install: vue => vue.component('file-upload', FileUpload)
}
