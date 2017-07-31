<template lang="pug">
div(style="text-align: center;")
  div.input-group
    file-upload(url='https://posttestserver.com/post.php?dump', :thumb-url='thumbUrl', @success="onSucess")
</template>

<script>
import Vue from 'vue'

import FileUpload from '../src/FileUpload.vue'
Vue.component('file-upload', FileUpload)

export default {
  name: 'demo',
  data () {
    return {
      success: false
    }
  },
  methods: {
    thumbUrl (file) {
      return (file && file.id) || this.success ? 'http://vuejs.org/images/logo.png' : ''
    },
    onSucess () {
      this.success = true
    }
  }
}
</script>

<style src="./style.css"></style>
<style lang="stylus">

</style>
