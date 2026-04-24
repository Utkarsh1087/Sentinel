require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listAll() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
  
  console.log("🔍 [SENTINEL DIAGNOSTIC] Listing ALL models available to this key...");
  
  try {
    // Correct way to list models in v0.21.0
    const response = await genAI.listModels();
    
    console.log("\n📋 AVAILABLE MODELS:");
    if (!response.models || response.models.length === 0) {
        console.log("⚠️ WARNING: Your list is empty! Your key has NO Gemini permissions.");
    } else {
        response.models.forEach(m => console.log(` - ${m.name}`));
    }
  } catch (err) {
    console.error("\n❌ GOOGLE SAID NO:", err.message);
    console.log("\n💡 THE VERDICT: This key is not authorized for the Generative AI API.");
    console.log("👉 Go to https://aistudio.google.com/app/apikey to get a 'Safe' key.");
  }
}

listAll();
