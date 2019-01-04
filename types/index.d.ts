import { Component } from 'vue'

export class FileUploadService {
  constructor(url: string, headers?: object, onProgress?: any, type?: string)

  upload(file: File, additionalData?: object): Promise<object>
}

export default Component
