const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Client = require('../models/Client');
const Contractor = require('../models/Contractor');
const Admin = require('../models/Admin'); // Nuevo modelo para admin

const router = express.Router();

// Registro de clientes
router.post('/register/client', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // Encripta la contraseña
    const client = new Client({
      ...req.body,
      password: hashedPassword, // Guarda la contraseña encriptada
    });
    const newClient = await client.save();
    res.status(201).json(newClient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Registro de contratistas
router.post('/register/contractor', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // Encripta la contraseña
    const contractor = new Contractor({
      ...req.body,
      password: hashedPassword, // Guarda la contraseña encriptada
    });
    const newContractor = await contractor.save();
    res.status(201).json(newContractor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Registro de administradores
router.post('/register/admin', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // Encripta la contraseña
    const admin = new Admin({
      ...req.body,
      password: hashedPassword, // Guarda la contraseña encriptada
    });
    const newAdmin = await admin.save();
    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  // Validación de campos faltantes
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  let Model;
  switch (role) {
    case 'client':
      Model = Client;
      break;
    case 'contractor':
      Model = Contractor;
      break;
    case 'admin':
      Model = Admin;
      break;
    default:
      return res.status(400).json({ message: 'Rol no válido' });
  }

  try {
    const user = await Model.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Verificar contraseña
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Credenciales inválidas' });

    // Generar token JWT
    const token = jwt.sign(
      { id: user._id, role }, // Información dentro del token
      process.env.JWT_SECRET, // Clave secreta del .env
      { expiresIn: '2h' }     // Tiempo de expiración del token
    );

    res.json({ token, userId: user._id, role });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
});

module.exports = router;
