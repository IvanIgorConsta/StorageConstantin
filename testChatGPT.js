const chatGPTRequest = require('./utils/chatGPT');

(async () => {
  const messages = [
    { role: "system", content: "Eres un asistente útil para desarrolladores." },
    { role: "user", content: "Escribe un modelo Mongoose para contratistas." }
  ];

  try {
    const response = await chatGPTRequest(messages);
    console.log('Respuesta de ChatGPT:', response);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
