import pdfParse from 'pdf-parse';

/**
 * Extract text content from PDF buffer
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<string>} Extracted text
 */
export async function processPDF(pdfBuffer) {
  try {
    const data = await pdfParse(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error('PDF processing error:', error);
    throw new Error('Failed to process PDF file');
  }
}
