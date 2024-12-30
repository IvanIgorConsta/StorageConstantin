const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Client = require('../models/Client');
const authenticateToken = require('../middleware/authMiddleware'); // Middleware para autenticación

const router = express.Router();

// Crear un cliente con validaciones
router.post(
  '/',
  [
    body('name').notEmpty().trim().withMessage('El nombre es obligatorio'),
    body('email').isEmail().trim().withMessage('Debe ser un correo electrónico válido'),
    body('phone').notEmpty().trim().withMessage('El número de teléfono es obligatorio'),
    body('location').notEmpty().trim().withMessage('La ubicación es obligatoria'),
    body('password').notEmpty().trim().withMessage('La contraseña es obligatoria'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const client = new Client(req.body);
      const savedClient = await client.save();
      res.status(201).json(savedClient);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: 'El correo ya está registrado. Usa otro correo.' });
      }
      res.status(500).json({ message: 'Error al crear el cliente', error });
    }
  }
);

// Obtener todos los clientes con paginación, búsqueda y filtro por ubicación
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', location = '' } = req.query;

    // Construir la consulta dinámica
    const query = {
      $and: [
        {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        },
        location ? { location: { $regex: location, $options: 'i' } } : {}, // Filtro parcial para location
      ],
    };

    console.log('Consulta generada:', query); // Log para depuración

    // Consultar clientes con paginación
    const clients = await Client.find(query)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .exec();

    const total = await Client.countDocuments(query);

    res.json({
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      clients,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los clientes', error });
  }
});

// Obtener un cliente por ID
router.get('/:id', authenticateToken, async (req, res) => {
  const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValidId) {
    return res.status(400).json({ message: 'ID inválido.' });
  }

  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el cliente', error });
  }
});

// Actualizar un cliente por ID
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedClient) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json(updatedClient);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el cliente', error });
  }
});

// Eliminar un cliente por ID
router.delete('/:id', authenticateToken, async (req, res) => {
  const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValidId) {
    return res.status(400).json({ message: 'ID inválido.' });
  }

  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    if (!deletedClient) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json({ message: 'Cliente eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el cliente', error });
  }
});

module.exports = router;
