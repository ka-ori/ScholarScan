import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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
 * Analyze research paper using OpenAI
 * @param {string} paperText - Full text of the research paper
 * @returns {Promise<Object>} Analysis results
 */
export async function analyzePaper(paperText) {
  try {
    // Truncate text if too long (OpenAI has token limits)
    const truncatedText = paperText.substring(0, 15000);

    const prompt = `Analyze the following research paper and extract the following information in JSON format:
1. title: The title of the paper
2. authors: The authors (as a comma-separated string, or null if not found)
3. summary: A concise 3-4 sentence summary of the paper's main contribution and findings
4. keywords: An array of 5-7 relevant keywords
5. category: The primary research domain (choose from: ${RESEARCH_CATEGORIES.join(', ')})
6. publicationYear: Year of publication (number, or null if not found)
7. journal: Journal or conference name (string, or null if not found)
8. doi: Digital Object Identifier (string, or null if not found)

Research Paper Text:
${truncatedText}

Respond ONLY with valid JSON in this exact format:
{
  "title": "...",
  "authors": "...",
  "summary": "...",
  "keywords": ["...", "..."],
  "category": "...",
  "publicationYear": 2024,
  "journal": "...",
  "doi": "..."
}`;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert research paper analyzer. Extract information accurately and respond only with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    const content = response.choices[0].message.content.trim();
    
    // Remove markdown code blocks if present
    const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
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
      doi: analysis.doi || null
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
      doi: null
    };
  }
}

/**
 * Alternative: Use Google Gemini API
 * Uncomment and modify this function if using Gemini instead of OpenAI
 */
/*
export async function analyzePaperWithGemini(paperText) {
  // Implementation for Google Gemini API
  // Similar structure to analyzePaper above
}
*/

/**
 * Alternative: Use Anthropic Claude API
 * Uncomment and modify this function if using Claude instead of OpenAI
 */
/*
export async function analyzePaperWithClaude(paperText) {
  // Implementation for Claude API
  // Similar structure to analyzePaper above
}
*/
