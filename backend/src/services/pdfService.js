import pdfParse from 'pdf-parse'

export async function processPDF(pdfBuffer) {
  try {
    const data = await pdfParse(pdfBuffer, {
      max: 0,
    })
    
    const extractedText = data.text.trim()
    
    if (!extractedText || extractedText.length < 50) {
      throw new Error(
        'This PDF appears to be scanned/image-based or has no extractable text. ' +
        'Please use a text-based PDF or try OCR processing first.'
      )
    }
    
    return {
      text: extractedText,
      numPages: data.numpages
    }
  } catch (error) {
    if (error.message.includes('scanned')) {
      throw error
    } else if (error.message.includes('encrypted')) {
      throw new Error('This PDF is password-protected or encrypted. Please use an unprotected PDF.')
    } else if (error.message.includes('Invalid PDF')) {
      throw new Error('Invalid or corrupted PDF file. Please try a different file.')
    } else {
      throw new Error('Failed to extract text from PDF: ' + error.message)
    }
  }
}
