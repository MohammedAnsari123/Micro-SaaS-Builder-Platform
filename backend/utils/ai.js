const axios = require('axios');

// Hugging Face API configuration
const HF_API_KEY = process.env.HF_API_KEY || '';
const HF_MODEL = process.env.HF_MODEL || 'mistralai/Mistral-7B-Instruct-v0.3';

/**
 * Generate text using the Hugging Face Inference API.
 * @param {string} prompt - Prompt instruction for the LLM
 * @returns {Promise<string>} Generated copywriting text
 */
const generateCopy = async (prompt) => {
    try {
        if (!HF_API_KEY) {
            throw new Error('Hugging Face API key is not configured.');
        }

        const response = await axios.post(
            `https://api-inference.huggingface.co/models/${HF_MODEL}`,
            {
                inputs: `<s>[INST] You are an expert copywriter for websites and SaaS platforms. Provide a concise, high-converting tag line, paragraph or call-to-action as requested. Respond with ONLY the requested text, do not add any intro, explanations, or quotes. \n\nRequest: ${prompt} [/INST]`,
                parameters: {
                    max_new_tokens: 120,
                    temperature: 0.7,
                    return_full_text: false
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${HF_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000 // 10s timeout
            }
        );

        if (response.data && response.data[0] && response.data[0].generated_text) {
            let result = response.data[0].generated_text.trim();
            // Clean up any residual markdown wrappers or formatting
            result = result.replace(/^["']|["']$/g, ''); // strip leading/trailing quotes
            return result;
        }

        throw new Error('Invalid response structure from Hugging Face.');
    } catch (err) {
        console.error('Hugging Face Generation Error:', err.response?.data || err.message);
        throw new Error(err.response?.data?.error || err.message || 'AI generation failed');
    }
};

module.exports = {
    generateCopy
};
