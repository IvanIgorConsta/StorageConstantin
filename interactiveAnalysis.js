require('dotenv').config();
const fs = require('fs');
const axios = require('axios');
const path = require('path');

// Función para realizar la solicitud a ChatGPT
const chatGPTRequest = async (content) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('No se encontró la clave API. Asegúrate de que está definida en el archivo .env.');
  }

  const messages = [
    { role: 'system', content: 'Eres un asistente experto en Node.js. Analiza y sugiere mejoras únicamente si son necesarias.' },
    { role: 'user', content: `Por favor, analiza este archivo y sugiere mejoras:\n\n${content}` },
  ];

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages,
        max_tokens: 500, // Reducir tokens para optimizar costos
        temperature: 0.3, // Bajo nivel de creatividad para respuestas más precisas
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

// Función para preprocesar el archivo (eliminar comentarios y líneas innecesarias)
const preprocessFile = (content) => {
  if (!content) {
    throw new Error('El contenido del archivo está vacío o no se pudo leer.');
  }

  return content
    .split('\n')
    .filter((line) => line.trim() !== '' && !line.trim().startsWith('//')) // Eliminar comentarios y líneas vacías
    .join('\n');
};

// Función principal
(async () => {
  try {
    const filePath = process.argv[2];
    if (!filePath) {
      console.error('Por favor, proporciona la ruta del archivo para analizar.');
      return;
    }

    const fullPath = path.resolve(filePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`El archivo especificado no existe: ${fullPath}`);
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    console.log(`Analizando archivo: ${fullPath}`);

    // Preprocesar el contenido antes de enviarlo a la API
    const processedContent = preprocessFile(content);

    // Enviar el contenido procesado a ChatGPT
    const response = await chatGPTRequest(processedContent);
    console.log(`Sugerencias:\n${response}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
//node interactiveAnalysis.js path/to/file.js
