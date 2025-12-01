/**
 * Blob Storage Service using Vercel Blob
 * Handles file uploads to cloud storage
 */
import { put, del, head } from '@vercel/blob';

// Check if Vercel Blob is configured
export const isVercelBlobConfigured = () => {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
};

/**
 * Upload a file to Vercel Blob
 * @param {string} filename - The name of the file
 * @param {Buffer|Stream} fileContent - The file content
 * @param {string} mimeType - The MIME type of the file
 * @returns {Promise<Object>} Blob response with url and metadata
 */
export const uploadFile = async (filename, fileContent, mimeType = 'application/pdf') => {
  if (!isVercelBlobConfigured()) {
    throw new Error('Vercel Blob is not configured. Set BLOB_READ_WRITE_TOKEN environment variable.');
  }

  try {
    // Add timestamp to filename to make it unique (avoid overwrite)
    const timestamp = Date.now();
    const [nameWithoutExt, ext] = filename.split(/\.(?=[^.]*$)/);
    const uniqueFilename = `papers/${timestamp}-${nameWithoutExt}.${ext}`;

    const blob = await put(uniqueFilename, fileContent, {
      access: 'public',
      contentType: mimeType,
      addRandomSuffix: false, // We're handling uniqueness with timestamp
    });

    return {
      url: blob.url,
      pathname: blob.pathname,
      contentType: mimeType,
      size: fileContent.length || 0,
    };
  } catch (error) {
    console.error('Blob upload error:', error);
    throw new Error(`Failed to upload file to blob storage: ${error.message}`);
  }
};

/**
 * Delete a file from Vercel Blob
 * @param {string} pathname - The pathname of the blob (from upload response)
 * @returns {Promise<void>}
 */
export const deleteFile = async (pathname) => {
  if (!isVercelBlobConfigured()) {
    return; // Silently ignore if not configured
  }

  try {
    await del(pathname);
  } catch (error) {
    console.error('Blob delete error:', error);
    // Don't throw - deletion failures shouldn't break the app
  }
};

/**
 * Get file metadata from Vercel Blob
 * @param {string} pathname - The pathname of the blob
 * @returns {Promise<Object>} Blob metadata
 */
export const getFileMetadata = async (pathname) => {
  if (!isVercelBlobConfigured()) {
    throw new Error('Vercel Blob is not configured.');
  }

  try {
    const metadata = await head(pathname);
    return metadata;
  } catch (error) {
    console.error('Blob metadata error:', error);
    throw new Error(`Failed to get blob metadata: ${error.message}`);
  }
};
