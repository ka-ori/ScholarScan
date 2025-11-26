import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

/**
 * Categories for research paper classification
 */
const RESEARCH_CATEGORIES = [
  'Computer Science',
  'Artificial Intelligence',
  'Machine Learning',
  'Natural Language Processing',
  'Computer Vision',
  'Bioinformatics',
  'Physics',
  'Mathematics',
  'Chemistry',
  'Biology',
  'Medicine',
  'Engineering',
  'Social Sciences',
  'Economics',
  'Psychology',
  'Other'
];

/**
 * Analyze research paper using Google Gemini
 * @param {string} paperText - Full text of the research paper
 * @param {number} numPages - Total number of pages in the PDF
 * @returns {Promise<Object>} Analysis results
 */
export async function analyzePaper(paperText, numPages = null) {
  try {
    // Truncate text if too long (Gemini can handle larger context, but we'll be safe)
    const truncatedText = paperText.substring(0, 30000);
    
    const prompt = `Analyze the following research paper and extract the following information in JSON format:
          
Research Paper Text:
${truncatedText}

${numPages ? `This paper has ${numPages} total pages.` : ''}

Respond ONLY with valid JSON in this exact format:
{
  "title": "Full paper title",
  "authors": "Author names as comma-separated string or null",
  "summary": "A comprehensive 8-10 sentence summary covering the problem, methodology, findings, and significance.",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7"],
  "category": "Choose from: ${RESEARCH_CATEGORIES.join(', ')}",
  "publicationYear": 2024 or null,
  "journal": "Journal/conference name or null",
  "doi": "DOI string or null",
  "keyFindings": [
    {
      "finding": "A specific finding or claim from the paper",
      "section": "Which section this came from (e.g., Abstract, Introduction, Methods, Results, Discussion, Conclusion)",
      "pageNumber": 1,
      "confidence": "high or medium or low",
      "textSnippet": "The exact 15-25 word quote from the paper that supports this finding - make sure this is a direct quote that appears in the text"
    }
  ]
}

IMPORTANT for keyFindings:
- Extract 5-7 key findings
- For pageNumber: Estimate which page (1-${numPages || 15}) based on section (Abstract/Intro=1-3, Methods=3-5, Results=5-10, Discussion/Conclusion=10-15)
- For textSnippet: Extract the EXACT quote from the text above that supports this finding (15-25 words)
- Make sure textSnippet is word-for-word from the paper text`;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const content = response.text().trim();
    
    console.log('Gemini raw response:', content);
    
    // Remove markdown code blocks if present
    const jsonContent = content.replaceAll(/```json\n?/g, '').replaceAll(/```\n?/g, '');
    const analysis = JSON.parse(jsonContent);
    
    // Validate and set defaults
    return {
      title: analysis.title || 'Untitled Paper',
      authors: analysis.authors || null,
      summary: analysis.summary || 'No summary available',
      keywords: Array.isArray(analysis.keywords) ? analysis.keywords : [],
      category: RESEARCH_CATEGORIES.includes(analysis.category) ? analysis.category : 'Other',
      publicationYear: analysis.publicationYear || null,
      journal: analysis.journal || null,
      doi: analysis.doi || null,
      keyFindings: Array.isArray(analysis.keyFindings) ? analysis.keyFindings : []
    };
  } catch (error) {
    console.error('AI analysis error:', error);
    
    // Fallback analysis if AI fails
    return {
      title: 'Analysis Error - Manual Review Required',
      authors: null,
      summary: 'AI analysis failed. Please review this paper manually.',
      keywords: ['error', 'manual-review-needed'],
      category: 'Other',
      publicationYear: null,
      journal: null,
      doi: null,
      keyFindings: []
    };
  }
}