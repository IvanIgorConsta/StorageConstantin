require('dotenv').config();
const fs = require('fs');
const axios = require('axios');

const validateDependencies = async () => {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
  const dependencies = Object.keys(packageJson.dependencies || {});

  const apiKey = process.env.OPENAI_API_KEY;
  const messages = [
    { role: 'system', content: 'Eres un asistente experto en Node.js.' },
    { role: 'user', content: `Revisa estas dependencias y sugiere si falta alguna:\n${dependencies.join(', ')}` },
  ];

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages,
        max_tokens: 500,
        temperature: 0.3,
      },
      {
        headers: { Authorization: `Bearer ${apiKey}` },
      }
    );
    console.log(`Sugerencias de dependencias:\n${response.data.choices[0].message.content}`);
  } catch (error) {
    console.error('Error al validar dependencias:', error.message);
  }
};

validateDependencies();
