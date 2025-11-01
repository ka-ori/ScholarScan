import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    console.log('🔍 Checking available Gemini models...\n');
    console.log('API Key:', process.env.GEMINI_API_KEY ? '✅ Found' : '❌ Not found');
    console.log('API Key (first 20 chars):', process.env.GEMINI_API_KEY?.substring(0, 20) + '...\n');
    
    // Try different model names
    const modelsToTry = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.0-pro',
      'models/gemini-pro',
      'models/gemini-1.5-pro',
      'models/gemini-1.5-flash'
    ];
    
    console.log('Testing models:\n');
    
    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say "Hello"');
        const response = result.response;
        const text = response.text();
        
        console.log(`✅ ${modelName} - WORKS!`);
        console.log(`   Response: ${text.substring(0, 50)}...\n`);
        
        // If we find a working model, we can stop
        console.log(`\n🎉 Use this model: "${modelName}"`);
        break;
      } catch (error) {
        console.log(`❌ ${modelName}`);
        console.log(`   Status: ${error.status || 'N/A'}`);
        console.log(`   Error: ${error.message}\n`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();
