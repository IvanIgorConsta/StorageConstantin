require('dotenv').config();
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

const EXCLUDED_DIRECTORIES = ['node_modules', '.git', 'logs', 'coverage'];

const chatGPTRequest = async (messages) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('No se encontró la clave API. Asegúrate de que está definida en el archivo .env.');
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages,
        max_tokens: 500, // Reducido para minimizar costos
        temperature: 0.3, // Menor creatividad para evitar gastos innecesarios
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

const processJSFile = async (fullPath) => {
  const content = await fs.readFile(fullPath, 'utf-8');

  // Verifica si el archivo ya fue procesado recientemente
  if (!content) return;

  const messages = [
    { role: 'system', content: 'Eres un asistente experto en Node.js. Solo analiza y sugiere mejoras críticas.' },
    { role: 'user', content: `Revisa este archivo y escribe solo una versión mejorada si es estrictamente necesario. Aquí está su contenido:\n\n${content}` },
  ];

  console.log(`Analizando: ${fullPath}`);
  const response = await chatGPTRequest(messages);

  // Verifica si el código necesita mejoras
  if (response.includes('No se necesita ninguna mejora')) {
    console.log(`Sin cambios necesarios para "${fullPath}".`);
    return;
  }

  // Sobrescribe el archivo solo si hay mejoras
  await fs.writeFile(fullPath, response);
  console.log(`Archivo modificado: ${fullPath}`);
};

const analyzeAndModifyFiles = async (dir) => {
  const files = await fs.readdir(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stats = await fs.stat(fullPath);

    if (stats.isDirectory()) {
      if (!EXCLUDED_DIRECTORIES.includes(file)) {
        await analyzeAndModifyFiles(fullPath);
      }
    } else if (file.endsWith('.js')) {
      try {
        await processJSFile(fullPath);
      } catch (error) {
        console.error(`Error al analizar y modificar "${fullPath}":`, error.message);
      }
    }
  }
};

(async () => {
  try {
    const projectDir = path.resolve(__dirname);
    console.log(`Analizando proyecto en: ${projectDir}`);

    await analyzeAndModifyFiles(projectDir);

    console.log('Análisis completado. Proyecto optimizado.');
  } catch (error) {
    console.error('Error en el análisis del proyecto:', error.message);
  }
})();
