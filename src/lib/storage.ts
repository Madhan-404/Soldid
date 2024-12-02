interface FileMetadata {
  title: string
  description: string
  fileName: string
  fileType: string
  fileSize: number
  timestamp: string
  fileCid: string
}

export const storeFileMetadata = (metadata: FileMetadata) => {
  try {
    const existingFiles = localStorage.getItem('uploadedFiles')
    const files = existingFiles ? JSON.parse(existingFiles) : []
    files.push(metadata)
    localStorage.setItem('uploadedFiles', JSON.stringify(files))
  } catch (error) {
    console.error('Error storing file metadata:', error)
  }
}

export const getStoredFiles = (): FileMetadata[] => {
  try {
    const files = localStorage.getItem('uploadedFiles')
    return files ? JSON.parse(files) : []
  } catch (error) {
    console.error('Error retrieving stored files:', error)
    return []
  }
} 