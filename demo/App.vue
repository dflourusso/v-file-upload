<template lang="pug">
div(style="text-align: center;")
  div.input-group
    file-upload(url='https://postman-echo.com/post', :thumb-url='thumbUrl', @success="onSucess", @error="onError", :additional-data="additionalData")
    .red {{error}}
</template>

<script>
import Vue from 'vue'

import FileUpload from '../src/FileUpload.vue'
Vue.component('file-upload', FileUpload)

export default {
  name: 'demo',
  data() {
    return {
      success: false,
      error: '',
      additionalData: {
        doc_id: 1
      }
    }
  },
  methods: {
    thumbUrl(file) {
      return (file && file.id) || this.success
        ? 'http://vuejs.org/images/logo.png'
        : ''
    },
    onSucess() {
      this.error = ''
      this.success = true
    },
    onError(e) {
      this.error = e
    }
  }
}
</script>

<style src="./style.css"></style>
<style lang="stylus">
.red {
  color: red;
}
</style>
