require('dotenv').config();
const axios = require('axios');

const apiKey = process.env.OPENAI_API_KEY;

const chatGPTRequest = async (messages, maxTokens = 3000) => {
  if (!apiKey) {
    throw new Error('No se encontró la clave API. Asegúrate de que está definida en el archivo .env.');
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages,
        max_tokens: maxTokens,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error al conectar con ChatGPT:', error.response?.data || error.message);
    throw new Error('Error en la solicitud a ChatGPT');
  }
};

module.exports = chatGPTRequest;

