<template lang="pug">
.file-upload
  .thumb-preview(v-if='thumbUrl(anexo)')
    .thumb-preview-item
      img(:src='thumbUrl(anexo)')
  .input-wrapper(:style='inputWrapperStyle')
    input.file-upload-input(:id='fileUploadInputName' type='file', name='file', @change='onChangeInputFile', :accept='accept', :multiple='false', :disabled='uploading', ref='input')
    label.file-upload-label(:for='fileUploadInputName')
      span.file-upload-icon(:class="{'file-upload-icon-pulse': uploading}") &#x21EA;
      div {{ uploading ? btnUploadingLabel : btnLabel }}
    div.file-upload-progress(:style='progressStyle')
</template>

<script>
import FileUpload from './FileUpload.js'

export default {
  props: {
    url: { type: String, required: true },
    thumbUrl: { type: Function, default: () => {} },
    accept: { type: String, default: '.png,.jpg' },
    headers: {
      type: Object,
      default: () => {
        return {}
      }
    },
    btnLabel: { type: String, default: 'Select a file' },
    btnUploadingLabel: { type: String, default: 'Uploading file' },
    maxSize: { type: Number, default: 15728640 }, // 15Mb
    additionalData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    requestType: { type: String, default: 'POST' },
    uniqueId: { type: String, default: '000' }
  },
  data() {
    return {
      progress: 0,
      anexo: {}
    }
  },
  computed: {
    uploading() {
      return this.progress > 0
    },
    progressStyle() {
      return {
        width: `${this.progress}%`,
        display: this.uploading ? 'block' : 'none'
      }
    },
    inputWrapperStyle() {
      return { opacity: this.uploading ? '0.7' : '1' }
    },
    fileUploadInputName() {
      return 'file-upload-input' + this.uniqueId
    }
  },
  methods: {
    onChangeInputFile(e) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      const file = files[0]
      if (file.size > this.maxSize) {
        this.$emit('error', {
          code: 'max_size_exceded',
          message: `File max size exceded, upload a file smaller than ${this
            .maxSize}`
        })
        return
      }

      this.upload(file)
    },

    upload(file) {
      this.progress = 0.1
      let fileUpload = new FileUpload(this.url, this.headers, this.onProgress, this.requestType)
      fileUpload
        .upload(file, this.additionalData)
        .then(e => {
          this.anexo = e.target.response
          this.onChangeAnexo()
          this.$emit('success', e)
          this.progress = 0
          this.cleanInput()
        })
        .catch(e => {
          this.$emit('error', e)
          this.progress = 0
          this.cleanInput()
        })
    },

    cleanInput() {
      let input = this.$refs.input
      if (input) {
        input.value = ''
      }
    },

    onProgress(e) {
      this.progress = parseInt(e.loaded * 100 / e.total)
      this.$emit('progress', this.progress)
    },

    onChangeAnexo() {
      this.$emit('change', this.anexo)
    }
  }
}
</script>

<style lang="stylus">
.file-upload {
  .input-wrapper {
    text-align: center;
    position: relative;
    background-color: #307DBF;
    height: 80px;

    &:hover {
      background-color: #2C70AC;
    }

    .file-upload-input {
      width: 0.1px;
      height: 0.1px;
      opacity: 0;
      overflow: hidden;
      position: absolute;
      z-index: -1;
    }

    .file-upload-label {
      width: 100%;
      font-size: 1.25em;
      color: white;
      display: inline-block;
      padding: 10px;
      position: absolute;
      left: 0;
      right: 0;
      z-index: 2;
      line-height: 1.4em;

      &:hover {
        cursor: pointer;
      }

      .file-upload-icon {
        display: inline-block;
        text-align: center;
        font-weight: bold;
        font-size: 40px;

        &.file-upload-icon-pulse {
          animation: fade 1.5s infinite 0.5s;
        }
      }
    }

    .file-upload-progress {
      position: absolute;
      background-color: #47B04B;
      height: 100%;
      max-width: 100%;
      z-index: 1;
      transition: width 0.6s ease;
    }
  }

  .thumb-preview {
    display: flex;
    flex-flow: row wrap;

    .thumb-preview-item {
      border-radius: 5px;
      margin: 5px;
      background-color: #cccccc;
      height: 150px;
      width: 150px;
      padding: 0;
      position: relative;

      img {
        border-radius: 5px;
      }
    }
  }
}

@keyframes fade {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

@keyframes fade {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}
</style>
