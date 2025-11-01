import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: join(__dirname, '.env') });

const apiKey = process.env.GEMINI_API_KEY;
console.log('API Key loaded:', apiKey ? `${apiKey.substring(0, 20)}...` : 'NOT FOUND');

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

async function test() {
  try {
    const result = await model.generateContent('Say hello in one word');
    const response = result.response;
    const text = response.text();
    console.log('✅ SUCCESS! Response:', text);
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('Status:', error.status);
  }
}

test();
