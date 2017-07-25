<template lang="pug">
div(style="text-align: center;")
  div.input-group
    file-upload(url='https://posttestserver.com/post.php?dump', :multiple='true', :thumb-url='thumbUrl')
</template>

<script>
import Vue from 'vue'

import FileUpload from '../src/FileUpload.vue'
Vue.component('file-upload', FileUpload)

export default {
  name: 'demo',
  methods: {
    thumbUrl (file) {
      return file.status == 'success' ? 'http://vuejs.org/images/logo.png' : ''
    }
  }
}
</script>

<style src="./style.css"></style>
<style lang="stylus">

</style>
