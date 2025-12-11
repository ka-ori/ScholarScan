import { put, del, head } from '@vercel/blob'

export const isVercelBlobConfigured = () => {
  return !!process.env.BLOB_READ_WRITE_TOKEN
}

export const uploadFile = async (filename, fileContent, mimeType = 'application/pdf') => {
  if (!isVercelBlobConfigured()) {
    throw new Error('Vercel Blob is not configured. Set BLOB_READ_WRITE_TOKEN environment variable.')
  }

  try {
    const timestamp = Date.now()
    const [nameWithoutExt, ext] = filename.split(/\.(?=[^.]*$)/)
    const uniqueFilename = `papers/${timestamp}-${nameWithoutExt}.${ext}`

    const blob = await put(uniqueFilename, fileContent, {
      access: 'public',
      contentType: mimeType,
      addRandomSuffix: false,
    })

    return {
      url: blob.url,
      pathname: blob.pathname,
      contentType: mimeType,
      size: fileContent.length || 0,
    }
  } catch (error) {
    throw new Error(`Failed to upload file to blob storage: ${error.message}`)
  }
}

export const deleteFile = async (pathname) => {
  if (!isVercelBlobConfigured()) {
    return
  }

  try {
    await del(pathname)
  } catch (error) {
    // Silently ignore
  }
}

export const getFileMetadata = async (pathname) => {
  if (!isVercelBlobConfigured()) {
    throw new Error('Vercel Blob is not configured.')
  }

  try {
    const metadata = await head(pathname)
    return metadata
  } catch (error) {
    throw new Error(`Failed to get blob metadata: ${error.message}`);
  }
};
