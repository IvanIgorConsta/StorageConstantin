const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Contractor = require('../models/Contractor');
const authenticateToken = require('../middleware/authMiddleware'); // Middleware de autenticación

const router = express.Router();

// Log para verificar que el middleware está correctamente importado
console.log('authenticateToken:', typeof authenticateToken);

// Crear un contratista con validaciones
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Debe ser un correo electrónico válido'),
    body('phone').notEmpty().withMessage('El número de teléfono es obligatorio'),
    body('location').notEmpty().withMessage('La ubicación es obligatoria'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
    body('priceRange').notEmpty().withMessage('El rango de precios es obligatorio'),
    body('contact').notEmpty().withMessage('El contacto es obligatorio'),
  ],
  async (req, res) => {
    console.log('POST /contractors: Body recibido:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Errores de validación:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const contractor = new Contractor(req.body);
      const savedContractor = await contractor.save();
      console.log('Contratista guardado:', savedContractor);
      res.status(201).json(savedContractor);
    } catch (error) {
      console.error('Error al guardar el contratista:', error);
      if (error.code === 11000) {
        return res.status(400).json({ message: 'El correo ya está registrado. Usa otro correo.' });
      }
      res.status(500).json({ message: 'Error al crear el contratista', error });
    }
  }
);

// Obtener todos los contratistas con paginación y búsqueda (Ruta protegida)
router.get('/', authenticateToken, async (req, res) => {
  console.log('GET /contractors: Query recibido:', req.query);
  try {
    const { page = 1, limit = 10, search = '', location = '' } = req.query;

    const query = {
      $and: [
        {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        },
        location ? { location: { $regex: location, $options: 'i' } } : {},
      ],
    };

    console.log('Consulta generada:', query);

    const contractors = await Contractor.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Contractor.countDocuments(query);

    console.log(`Total de contratistas encontrados: ${total}`);
    res.json({
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      contractors,
    });
  } catch (error) {
    console.error('Error al obtener los contratistas:', error);
    res.status(500).json({ message: 'Error al obtener los contratistas', error });
  }
});

// Obtener un contratista por ID (Ruta protegida)
router.get('/:id', authenticateToken, async (req, res) => {
  console.log('GET /contractors/:id: ID recibido:', req.params.id);
  const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValidId) {
    console.log('ID inválido:', req.params.id);
    return res.status(400).json({ message: 'ID inválido.' });
  }

  try {
    const contractor = await Contractor.findById(req.params.id);
    if (!contractor) {
      console.log('Contratista no encontrado:', req.params.id);
      return res.status(404).json({ message: 'Contratista no encontrado' });
    }
    console.log('Contratista encontrado:', contractor);
    res.json(contractor);
  } catch (error) {
    console.error('Error al obtener el contratista:', error);
    res.status(500).json({ message: 'Error al obtener el contratista', error });
  }
});

// Actualizar un contratista por ID (Ruta protegida)
router.put('/:id', authenticateToken, async (req, res) => {
  console.log('PUT /contractors/:id: ID recibido:', req.params.id);
  console.log('PUT /contractors/:id: Body recibido:', req.body);
  const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValidId) {
    console.log('ID inválido:', req.params.id);
    return res.status(400).json({ message: 'ID inválido.' });
  }

  try {
    const updatedContractor = await Contractor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedContractor) {
      console.log('Contratista no encontrado para actualizar:', req.params.id);
      return res.status(404).json({ message: 'Contratista no encontrado' });
    }

    console.log('Contratista actualizado:', updatedContractor);
    res.json(updatedContractor);
  } catch (error) {
    console.error('Error al actualizar el contratista:', error);
    res.status(400).json({ message: 'Error al actualizar el contratista', error });
  }
});

// Eliminar un contratista por ID (Ruta protegida)
router.delete('/:id', authenticateToken, async (req, res) => {
  console.log('DELETE /contractors/:id: ID recibido:', req.params.id);
  const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValidId) {
    console.log('ID inválido:', req.params.id);
    return res.status(400).json({ message: 'ID inválido.' });
  }

  try {
    const deletedContractor = await Contractor.findByIdAndDelete(req.params.id);
    if (!deletedContractor) {
      console.log('Contratista no encontrado para eliminar:', req.params.id);
      return res.status(404).json({ message: 'Contratista no encontrado' });
    }

    console.log('Contratista eliminado:', deletedContractor);
    res.json({ message: 'Contratista eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el contratista:', error);
    res.status(400).json({ message: 'Error al eliminar el contratista', error });
  }
});

module.exports = router;
