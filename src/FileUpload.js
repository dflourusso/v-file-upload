// fileList == document.getElementById('fileInput').files
const FileUpload = (url, fileList, headers, onProgress, onReadyStateChange) => {

  let xhr = new XMLHttpRequest()
  xhr.responseType = 'json'

  // Headers
  xhr.open('POST', url, true)

  Object.keys(headers).forEach(p => xhr.setRequestHeader(p, headers[p]))

  // Events
  xhr.upload.addEventListener('progress', onProgress, false)
  xhr.onreadystatechange = onReadyStateChange
  let promise = new Promise((resolve, reject) => {
    xhr.onload = e => xhr.status >= 200 && xhr.status < 400 ? resolve(e) : reject(e)
    xhr.onerror = e => reject(e)
  })

  // Start upload
  let formData = new FormData()
  if (fileList) {
    for (let i = 0; i < fileList.length; i++) {
      formData.append('files[]', fileList.item(i))
    }
  }

  xhr.send(formData)

  return promise
}

export default FileUpload
