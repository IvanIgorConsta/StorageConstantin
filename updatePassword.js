const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Contractor = require('./models/Contractor'); // Asegúrate de la ruta correcta

require('dotenv').config();

async function updatePassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    console.log('Conectado a MongoDB');

    const contractor = await Contractor.findById('677081ac82e30062df8ecd2f'); // ID del contratista
    if (!contractor) {
      console.error('Contratista no encontrado');
      return;
    }

    const hashedPassword = await bcrypt.hash('securepassword', 10); // Encripta la contraseña
    contractor.password = hashedPassword;
    await contractor.save();

    console.log('Contraseña actualizada correctamente');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    mongoose.disconnect();
  }
}

updatePassword();
