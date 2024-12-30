const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Client = require('./models/Client');
const Contractor = require('./models/Contractor');

require('dotenv').config();

async function encryptPasswordForUser(user) {
  if (user.password && !user.password.startsWith('$2b$')) {
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    console.log(`Contraseña encriptada para ${user.name}`);
  } else if (!user.password) {
    console.log(`${user.name} no tiene contraseña.`);
  }
}

async function encryptPasswords() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Conectado a MongoDB');

    const clients = await Client.find();
    const contractors = await Contractor.find();

    await Promise.all(clients.map(encryptPasswordForUser));
    await Promise.all(contractors.filter(contractor => contractor.email && contractor.phone).map(encryptPasswordForUser));

    console.log('Contraseñas actualizadas correctamente');
  } catch (error) {
    console.error('Error al actualizar contraseñas:', error);
  } finally {
    mongoose.disconnect();
  }
}

encryptPasswords();
