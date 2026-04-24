require('dotenv').config();
const axios = require('axios');

async function checkOpenRouter() {
  const apiKey = (process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY || '').trim();
  
  console.log("🔍 [SENTINEL DIAGNOSTIC] Fetching OpenRouter models...");
  
  try {
    const res = await axios.get('https://openrouter.ai/api/v1/models', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    
    console.log("\n📋 AVAILABLE GEMINI MODELS:");
    const geminiModels = res.data.data.filter(m => m.id.toLowerCase().includes('gemini'));
    
    if (geminiModels.length === 0) {
        console.log("⚠️ No Gemini models found! This key might be restricted.");
    } else {
        geminiModels.forEach(m => console.log(` - ${m.id}`));
    }
  } catch (err) {
    console.error("❌ FAILED:", err.message);
  }
}

checkOpenRouter();
