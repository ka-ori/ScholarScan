import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const SAMPLE_TEXT = `
Title: Attention Is All You Need
Authors: Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin

Abstract
The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train. Our model achieves 28.4 BLEU on the WMT 2014 English-to-German translation task, improving over the existing best results, including ensembles, by over 2 BLEU. On the WMT 2014 English-to-French translation task, our model establishes a new single-model state-of-the-art BLEU score of 41.8 after training for 3.5 days on eight GPUs, a small fraction of the training costs of the best models from the literature. We show that the Transformer generalizes well to other tasks by applying it successfully to English constituency parsing both with large and limited training data.
`;

async function runTest() {
  console.log('Testing AI Analysis Service...');
  
  const openaiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  
  console.log('Environment Check:');
  console.log(`- OPENAI_API_KEY: ${openaiKey ? 'Present' : 'Missing'}`);
  console.log(`- GEMINI_API_KEY: ${geminiKey ? 'Present' : 'Missing'}`);
  
  if (!openaiKey && !geminiKey) {
    console.error('ERROR: No API keys found in .env file.');
    process.exit(1);
  }

  // Force provider if specified in args
  const providerArg = process.argv[2];
  if (providerArg) {
    process.env.AI_PROVIDER = providerArg;
    console.log(`Forcing provider to: ${providerArg}`);
  }

  // Dynamic import to pick up env changes
  const { analyzePaper } = await import('../src/services/aiService.js');

  try {
    const result = await analyzePaper(SAMPLE_TEXT);
    console.log('\nAnalysis Result:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.title.includes('Attention Is All You Need') && result.category !== 'Other') {
      console.log('\n✅ Test PASSED: Analysis seems correct.');
    } else {
      console.log('\n❌ Test FAILED: Unexpected analysis result.');
    }
  } catch (error) {
    console.error('\n❌ Test FAILED with error:', error);
  }
}

runTest();
