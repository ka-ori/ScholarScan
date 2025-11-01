import pdfParse from 'pdf-parse';

/**
 * Extract text content from PDF buffer with page information
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<{text: string, pages: Array, numPages: number}>} Extracted text with page info
 */
export async function processPDF(pdfBuffer) {
  try {
    const data = await pdfParse(pdfBuffer, {
      max: 0, // Parse all pages
    });
    
    const extractedText = data.text.trim();
    
    console.log('PDF Info:', {
      pages: data.numpages,
      textLength: extractedText.length,
      info: data.info
    });
    
    // Check if we got meaningful text
    if (!extractedText || extractedText.length < 50) {
      throw new Error(
        'This PDF appears to be scanned/image-based or has no extractable text. ' +
        'Please use a text-based PDF or try OCR processing first.'
      );
    }
    
    return {
      text: extractedText,
      numPages: data.numpages
    };
  } catch (error) {
    console.error('PDF processing error:', error.message);
    
    // Provide specific error messages
    if (error.message.includes('scanned')) {
      throw error; // Re-throw our custom message
    } else if (error.message.includes('encrypted')) {
      throw new Error('This PDF is password-protected or encrypted. Please use an unprotected PDF.');
    } else if (error.message.includes('Invalid PDF')) {
      throw new Error('Invalid or corrupted PDF file. Please try a different file.');
    } else {
      throw new Error('Failed to extract text from PDF: ' + error.message);
    }
  }
}
