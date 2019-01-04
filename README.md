# v-file-upload

> File upload component for Vue.js

<p>
  <a href="https://www.npmjs.com/package/v-file-upload"><img src="https://img.shields.io/npm/dm/v-file-upload.svg" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/v-file-upload"><img src="https://img.shields.io/npm/v/v-file-upload.svg" alt="Version"></a>
  <a href="https://www.npmjs.com/package/v-file-upload"><img src="https://img.shields.io/npm/l/v-file-upload.svg" alt="License"></a>
</p>

## Installation

### Using yarn

`yarn add v-file-upload`

### Using npm

`npm i --save v-file-upload`

## Demo

[DEMO](http://dflourusso.github.io/v-file-upload)

## Usage

### As component

```js
import Vue from 'vue'

import FileUpload from 'v-file-upload'

Vue.use(FileUpload)
```

### As service

```js
import { FileUploadService } from 'v-file-upload'
```

## Examples

### As component

```html
<template>
  <file-upload :url='url' :thumb-url='thumbUrl' :headers="headers" @change="onFileChange"></file-upload>
</template>

<script>
import Vue from 'vue'
import FileUpload from 'v-file-upload'
Vue.use(FileUpload)

export default {
  data () {
    return {
      url: 'http://your-post.url',
      headers: {'access-token': '<your-token>'},
      filesUploaded: []
    }
  },
  methods: {
    thumbUrl (file) {
      return file.myThumbUrlProperty
    },
    onFileChange (file) {
      // Handle files like:
      this.fileUploaded = file
    }
  }
}
</script>
```

#### Properties

| Name                    | Type     | Required | Default         | Info                                                           |
| ----------------------- | -------- | -------- | --------------- | -------------------------------------------------------------- |
| **url**                 | String   | True     |                 | Url to POST the files                                          |
| **thumb-url**           | Function | True     |                 | Method that should returns the thumb url for the uploaded file |
| **accept**              | String   | False    | .png,.jpg       | File input accept filter                                       |
| **headers**             | Object   | False    | {}              | Headers for the request. You can pass auth tokens for example  |
| **btn-label**           | String   | False    | Select a file   | Label for the button                                           |
| **btn-uploading-label** | String   | False    | Uploading files | Label for the button when the upload is in progress            |
| **max-size**            | Number   | False    | 15728640 //15Mb | Max size for the file                                          |
| **additional-data**     | Object   | False    | {}              | Additional data for the request                                |

#### Events

| Name         | Params                           | Info                                                                       |
| ------------ | -------------------------------- | -------------------------------------------------------------------------- |
| **success**  | _event_: XMLHttpRequest event    | Triggered after POST success                                               |
| **error**    | _event_: XMLHttpRequest event    | Triggered after POST error                                                 |
| **change**   | _files_: Array of uploaded files | Triggered after add or remove a file                                       |
| **progress** | _progress_: Progress percentage  | Triggered while the upload is in progress indicating the upload percentage |

### As service

```js
import { FileUploadService } from 'v-file-upload'
export default {
  data() {
    return {
      url: 'http://your-post.url',
      headers: { 'access-token': '<your-token>' }
    }
  },
  methods: {
    mySaveMethod(file) {
      let fileUpload = new FileUploadService(
        this.url,
        this.headers,
        this.onProgress
      )
      fileUpload
        .upload(file, { doc_id: 1 })
        .then(e => {
          // Handle success
        })
        .catch(e => {
          // Handle error
        })
    },
    onProgress(event) {
      // Handdle the progress
    }
  }
}
```

## Development

`yarn dist`

## Author

* [Daniel Fernando Lourusso](http://dflourusso.com.br)

## License

This project is licensed under
[MIT License](http://en.wikipedia.org/wiki/MIT_License)
