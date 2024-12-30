require('dotenv').config();
const axios = require('axios');

const generateMongooseModel = async (modelName, fields) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('No se encontró la clave API. Asegúrate de que está definida en el archivo .env.');
  }

  const messages = [
    { role: 'system', content: 'Eres un experto en Node.js y Mongoose. Genera modelos eficientemente.' },
    { role: 'user', content: `Crea un modelo Mongoose llamado "${modelName}" con los siguientes campos:\n${JSON.stringify(fields, null, 2)}` },
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
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error al conectar con ChatGPT:', error.response?.data || error.message);
    throw new Error('Error en la solicitud a ChatGPT');
  }
};

(async () => {
  const modelName = process.argv[2];
  const fields = JSON.parse(process.argv[3] || '{}');

  if (!modelName || !Object.keys(fields).length) {
    console.error('Proporciona un nombre de modelo y campos. Ejemplo: node generateModel.js User \'{"name":"String","email":"String"}\'');
    return;
  }

  try {
    const model = await generateMongooseModel(modelName, fields);
    console.log(`Modelo generado:\n${model}`);
  } catch (error) {
    console.error('Error al generar el modelo:', error.message);
  }
})();
