<template lang="pug">
.file-upload
  .thumb-preview(v-if='anexos.length > 0 && showThumbs')
    .thumb-preview-item(v-for='anexo in anexos')
      .progress-spin(:style="progressSpinStyle(anexo)") &#9676;
      .progress(:style="itemProgressStyle(anexo)")
      label.red(@click='removeAnexo(anexo)', v-if="anexo.status == 'success'") &times;
      img(:src='thumbUrl(anexo)')
  .input-wrapper(v-if="status == 'error'", style="background-color: #d9534f;")
    label.file-upload-label(@click="upload(anexos)")
      span.file-upload-icon &times;
      div {{ btnErrorLabel }}
  .input-wrapper(:style='inputWrapperStyle', v-else)
    input#file-upload-input(type='file', name='file', @change='onChangeInputFile', :accept='accept', :multiple='multiple', :disabled='uploading')
    label.file-upload-label(for='file-upload-input')
      span.file-upload-icon(:class="{'file-upload-icon-pulse': uploading}") &#x21EA;
      div {{ uploading ? btnUploadingLabel : btnLabel }}
    div.file-upload-progress(:style='progressStyle')
</template>

<script>
import FileUpload from './FileUpload.js'

export default {
  props: {
    url: { type: String, required: true},
    showThumbs: { type: Boolean, default: true },
    thumbUrl: { type: Function, default: () => {} },
    accept: { type: String, default: '.png,.jpg'},
    multiple: { type: Boolean, default: true },
    headers: { type: Object, default: () => {return {}} },
    btnLabel: { type: String, default: 'Select a file'},
    btnErrorLabel: { type: String, default: 'Erro ao enviar arquivos, tentar novamente?'},
    btnUploadingLabel: { type: String, default: 'Uploading files'}
  },
  data() {
    return {
      progress: 0,
      status: 'waiting',
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
      this.upload(files)
    },

    upload(files) {
      this.progress = .1
      this.status = 'loading'
      let fileUpload = new FileUpload(this.url, this.headers, this.onProgress)
      fileUpload.uploadFiles(files).then((e) => {
        this.onChangeAnexos()
        this.$emit('success', e)
        this.status = 'success'
        this.progress = 0
      }).catch((e) => {
        this.status = 'error'
        this.$emit('error', e)
        this.progress = 0
      })
    },

    onProgress (e) {
      this.progress = e.progress
      this.$emit('progress', this.progress)
      this.anexos.splice(0, this.anexos.length)
      e.files.forEach(p => this.anexos.push(p))
    },

    itemProgressStyle (item) {
      return {
        width: `${item.progress || 0}%`,
        display: item.status == 'loading' ? 'block' : 'none'
      }
    },

    progressSpinStyle (item) {
      return {
        display: ['waiting', 'loading'].indexOf(item.status) > -1 ? 'block' : 'none'
      }
    },

    removeAnexo: function (anexo) {
      this.anexos.splice(this.anexos.indexOf(anexo), 1)
      this.onChangeAnexos()
    },

    onChangeAnexos () {
      this.$emit('change', this.anexos)
    }
  },
  created () {
    window.c = this
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
      transition width .6s ease


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
      position relative
      .progress
        position absolute
        background-color #47B04B
        height 100%
        max-width 100%
        z-index 1
        opacity .8
        transition width .6s ease
        border-radius 5px
      .progress-spin
        position absolute
        height 100%
        width 100%
        text-align center
        font-size 90px
        animation rotating 3s linear infinite
        color #fff
        z-index 2
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
        left 8px
        top 8px
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

@-webkit-keyframes rotating
  from
    -webkit-transform rotate(0deg)
  to
    -webkit-transform rotate(360deg)
@keyframes rotating
  from
    -webkit-transform rotate(0deg)
  to
    -webkit-transform rotate(360deg)
</style>
