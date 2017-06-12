<template lang="pug">
.file-upload
  .thumb-preview(v-if='anexos.length > 0')
    .thumb-preview-item(v-for='anexo in anexos')
      label.red(@click='removeAnexo(anexo)') &times;
      img(:src='thumbUrl(anexo)')
  .input-wrapper(:style='inputWrapperStyle')
    input#file-upload-input(type='file', name='file', @change='onChangeInputFile', :accept='accept', :multiple='multiple', :disabled='uploading')
    label.file-upload-label(for='file-upload-input')
      span.file-upload-icon.fu-spin(:class="{'file-upload-icon-pulse': uploading}") &#x21EA;
      div {{ uploading ? btnUploadingLabel : btnLabel }}
    div.file-upload-progress(:style='progressStyle')
</template>

<script>
import FileUpload from './FileUpload.js'
export default {
  props: {
    url: { type: String, required: true},
    thumbUrl: { type: Function, required: true },
    accept: { type: String, default: '.png,.jpg'},
    multiple: { type: Boolean, default: true },
    headers: { type: Object, default: () => {return {}} },
    btnLabel: { type: String, default: 'Select a file'},
    btnUploadingLabel: { type: String, default: 'Uploading files'}
  },
  data() {
    return {
      progress: 0,
      anexos: []
    }
  },
  computed: {
    uploading () {
      return this.progress > 0
    },
    progressStyle () {
      return {
        width: `${this.progress}%`,
        display: this.uploading ? 'block' : 'none'
      }
    },
    inputWrapperStyle () {
      return { opacity: this.uploading ? '0.7' : '1' }
    }
  },
  methods: {
    onChangeInputFile (e) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      this.progress = .1
      FileUpload(this.url, files, this.headers, this.onProgress, this.onReadyStateChange).then((e) => {
        if (Array.isArray(e.target.response)) {
          this.anexos = this.anexos.concat(e.target.response)
        } else {
          this.anexos.push(e.target.response)
        }
        this.onChangeAnexos()
        this.$emit('success', e)
      }).catch((e) => {
        this.$emit('error', e)
      })
    },

    onProgress (e) {
      let p = parseInt(e.loaded * 100 / e.total)
      if (p > this.progress) {
        this.progress = p
        this.$emit('progress', this.progress)
      }
    },

    onReadyStateChange (e) {
      this.$emit('ready-state-change', e)
      if (e.target.readyState == 4) this.progress = 0
    },

    removeAnexo: function (anexo) {
      this.anexos.splice(this.anexos.indexOf(anexo), 1)
      this.onChangeAnexos()
    },

    onChangeAnexos () {
      this.$emit('change', this.anexos)
    }
  }
}
</script>

<style lang="stylus">
.file-upload
  .input-wrapper
    text-align center
    position relative
    background-color #307DBF
    height 80px
    &:hover
      background-color #2C70AC
    #file-upload-input
      width 0.1px
      height 0.1px
      opacity 0
      overflow hidden
      position absolute
      z-index -1
    .file-upload-label
      width 100%
      font-size 1.25em
      color white
      display inline-block
      padding 10px
      position absolute
      left 0
      right 0
      z-index 2
      line-height 1.4em
      &:hover
        cursor pointer
      .file-upload-icon
        display inline-block
        text-align center
        font-weight bold
        font-size 40px
        &.file-upload-icon-pulse
          animation fade 1.5s infinite .5s
    .file-upload-progress
      position absolute
      background-color #47B04B
      height 100%
      max-width 100%
      z-index 1
      transition all .6s ease


  .thumb-preview
    display flex
    flex-flow row wrap
    .thumb-preview-item
      border-radius 5px
      margin 5px
      background-color #cccccc
      height 150px
      width 150px
      padding 0
      .red
        color red
      img
        border-radius 5px
      label
        position absolute
        padding 0 8px 5px 8px
        border-radius 50px
        font-weight bolder
        font-size 30px
        line-height 1em
        margin 5px
        background-color rgba(255, 255, 255, 0.6)
        &:hover
          background-color #FFFFFF
          cursor pointer

@-webkit-keyframes fade
  from
    opacity 1
  to
    opacity 0

@keyframes fade
  from
    opacity 1
  to
    opacity 0
</style>
