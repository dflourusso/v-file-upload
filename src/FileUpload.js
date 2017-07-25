class FileUpload {
  constructor(url, headers = {}, onProgress = ()=>{}) {
    this.url = url
    this.headers = headers
    this.onProgress = onProgress
  }

  uploadFiles(files) {
    this._prepareFiles(files)
    let promise = new Promise((resolve, reject) => {
      this.__uploadFile(0, resolve, reject)
    })

    return promise
  }

  __uploadFile(index, resolve, reject) {
    if(!this.files[index]) {
      let hasError = this.files.find(p => p.status === 'error')
      return hasError ? reject(this.files) : resolve(this.files)
    }
    if (this.files[index].status == 'success') {
      return this.__uploadFile(++index, resolve, reject)
    }
    return this._uploadFile(this.files[index]).then((e) => {
      this.__uploadFile(++index, resolve, reject)
    }).catch(() => {
      this.__uploadFile(++index, resolve, reject)
    })
  }

  _uploadFile(file) {
    let xhr = new XMLHttpRequest()
    xhr.responseType = 'json'

    // Headers
    xhr.open('POST', this.url, true)
    this._setXhrHeaders(xhr)

    // Events
    xhr.upload.addEventListener('progress', (e) => {this._onProgress(e, file)}, false)
    let promise = new Promise((resolve, reject) => {
      xhr.onload = (e) => {
        file.progress = 0
        if (xhr.status >= 200 && xhr.status < 400) {
          file.response = e.target.response
          file.status = 'success'
          return resolve(e)
        } else {
          file.status = 'error'
          return reject(e)
        }
      }
      xhr.onerror = (e) => {
        file.status = 'error'
        file.progress = 0
        return reject(e)
      }
    })

    // Start upload
    let formData = new FormData()
    formData.append('file', file)
    file.status = 'loading'
    xhr.send(formData)

    return promise
  }

  _setXhrHeaders(xhr) {
    Object.keys(this.headers).forEach(p => xhr.setRequestHeader(p, this.headers[p]))
  }

  _prepareFiles(files) {
    this.files = []
    if (files) {
      for (let i = 0; i < files.length; i++) {
        let f = files[i]
        if (!f.status) f.status = 'waiting'
        this.files.push(f)
      }
      this._setTotalSize()
    }
  }

  _setTotalSize() {
    this.totalLoaded = 0
    this.totalSize = 0
    this.files.forEach((p) => {
      this.totalSize += p.size
    })
  }

  _onProgress (e, file) {
    if (!file.progress) file.progress = file.loaded = 0
    let p = parseInt(e.loaded * 100 / e.total)
    this.totalLoaded += e.loaded - file.loaded
    file.loaded = e.loaded
    if (p > file.progress) {
      file.progress = p
      let totalProgress = this.totalLoaded * 100 / this.totalSize
      this.onProgress(this.files ? {progress: totalProgress, files: this.files} : file)
    }
  }
}

export default FileUpload
