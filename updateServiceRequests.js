const mongoose = require('mongoose');
const ServiceRequest = require('./models/ServiceRequest'); // Ajusta la ruta si es necesario
require('dotenv').config(); // Asegurarse de cargar las variables de entorno

async function updateSchema() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('No se encontró la variable MONGO_URI en el archivo .env');
  }

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log('Conectado a MongoDB');

  // Actualizar todos los documentos para asegurar compatibilidad con el nuevo enum
  await ServiceRequest.updateMany({}, { $set: { status: 'Pendiente' } });
  console.log('Documentos actualizados correctamente.');

  mongoose.connection.close();
}

updateSchema().catch((error) => {
  console.error('Error al actualizar los documentos:', error);
});
