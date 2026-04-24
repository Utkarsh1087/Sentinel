require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function findModel() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
  
  const modelsToTry = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro",
    "gemini-1.0-pro",
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro-latest"
  ];

  console.log("🔍 [SENTINEL DIAGNOSTIC] Searching for a working model...\n");

  for (const m of modelsToTry) {
    try {
      process.stdout.write(`Testing ${m}... `);
      const model = genAI.getGenerativeModel({ model: m });
      await model.generateContent("test");
      console.log("✅ WORKS!");
      console.log(`\n🎉 FOUND IT! The working model is: ${m}`);
      return;
    } catch (err) {
      console.log(`❌ (${err.message.includes('404') ? '404 Not Found' : err.message.substring(0, 50)})`);
    }
  }

  console.log("\n⚠️ ALL MODELS FAILED. This usually means the API key is not enabled for Gemini yet.");
}

findModel();
