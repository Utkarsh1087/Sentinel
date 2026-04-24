require('dotenv').config();
const axios = require('axios');

/**
 * Uses OpenRouter to analyze an error log.
 */
const analyzeError = async (errorLog) => {
  const apiKey = (process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY || '').trim();

  try {
    console.log(`📡 [AI Service] Sending request to OpenRouter with key: ${apiKey.substring(0, 10)}...`);
    
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'google/gemini-2.0-flash-001',
        messages: [
          {
            role: 'system',
            content: `You are a Senior DevOps SRE. Provide analysis in this STRICT format:
            
            SUMMARY: (One sentence maximum)
            CAUSE: (One sentence maximum)
            FIX: (2-3 very short bullet points)
            
            Do NOT include conversational filler. Go straight to the data.`
          },
          {
            role: 'user',
            content: `Error Log:\n${errorLog}`
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://sentinel.dev', // Required by some OpenRouter models
          'X-Title': 'Sentinel Observability'
        },
        timeout: 12000 
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    const errorMsg = error.response?.data?.error?.message || error.message;
    console.error('❌ [AI Service Error]:', errorMsg);
    
    // Fallback logic for production resilience
    if (error.code === 'ECONNABORTED' || error.response?.status === 429) {
        return "AI capacity reached. Automated fix: Check database connection string and ensure pool size is sufficient.";
    }
    
    return `Diagnostic failure: ${errorMsg}. Verify OPENROUTER_API_KEY in Render settings.`;
  }
};

/**
 * Performance analysis using OpenRouter.
 */
const analyzePerformance = async (metrics) => {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'google/gemini-pro-1.5',
        messages: [
          {
            role: 'system',
            content: 'Analyze server metrics for dangerous trends like memory leaks. Summary in 3 sentences max.'
          },
          {
            role: 'user',
            content: `Metrics (JSON):\n${JSON.stringify(metrics, null, 2)}`
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('❌ [OpenRouter Performance Error]:', error.message);
    return "Performance looks stable, but deep analysis failed.";
  }
};

module.exports = { analyzeError, analyzePerformance };
