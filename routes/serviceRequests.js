const mongoose = require('mongoose');
const express = require('express');
const { body, validationResult } = require('express-validator');
const ServiceRequest = require('../models/ServiceRequest');
const Client = require('../models/Client');
const Contractor = require('../models/Contractor');
const Notification = require('../models/Notification'); // Importar modelo de notificaciones
const authenticateToken = require('../middleware/authMiddleware'); // Importar el middleware de autenticación

const router = express.Router();

// Crear una solicitud de servicio con notificación para el contratista
router.post(
  '/',
  authenticateToken, // Middleware de autenticación
  [
    body('clientId').notEmpty().withMessage('El ID del cliente es obligatorio'),
    body('contractorId').notEmpty().withMessage('El ID del contratista es obligatorio'),
    body('description').notEmpty().withMessage('La descripción es obligatoria'),
    body('date').isISO8601().withMessage('La fecha debe estar en formato válido (ISO 8601)'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { clientId, contractorId, date, description } = req.body;

    try {
      // Validar IDs
      if (!mongoose.Types.ObjectId.isValid(clientId)) {
        return res.status(400).json({ message: 'El ID del cliente no tiene un formato válido' });
      }
      if (!mongoose.Types.ObjectId.isValid(contractorId)) {
        return res.status(400).json({ message: 'El ID del contratista no tiene un formato válido' });
      }

      // Verificar existencia de cliente y contratista
      const clientExists = await Client.findById(clientId);
      if (!clientExists) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }
      const contractorExists = await Contractor.findById(contractorId);
      if (!contractorExists) {
        return res.status(404).json({ message: 'Contratista no encontrado' });
      }

      // Crear la solicitud de servicio
      const newRequest = new ServiceRequest({ clientId, contractorId, date, description });
      await newRequest.save();

      // Crear notificación para el contratista
      const notification = new Notification({
        userId: contractorId,
        userType: 'Contractor',
        message: `Se te ha asignado una nueva solicitud: "${description}".`,
        type: 'assigned',
      });
      await notification.save();

      res.status(201).json(newRequest);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la solicitud de servicio', error });
    }
  }
);

// Actualizar el estado de una solicitud con notificación para el cliente
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Nuevo estado

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'El ID de la solicitud no tiene un formato válido' });
    }

    const updatedRequest = await ServiceRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    // Crear notificación para el cliente
    const notification = new Notification({
      userId: updatedRequest.clientId,
      userType: 'Client',
      message: `El estado de tu solicitud ha cambiado a: "${status}".`,
      type: 'status_change',
    });
    await notification.save();

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la solicitud', error });
  }
});

// Listar solicitudes de un contratista con paginación
router.get('/contractor/:contractorId', authenticateToken, async (req, res) => {
  try {
    const { contractorId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(contractorId)) {
      return res.status(400).json({ message: 'El ID del contratista no tiene un formato válido' });
    }

    const requests = await ServiceRequest.find({ contractorId })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ServiceRequest.countDocuments({ contractorId });

    res.json({
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      requests,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las solicitudes', error });
  }
});

// Listar solicitudes de un cliente con paginación
router.get('/client/:clientId', authenticateToken, async (req, res) => {
  try {
    const { clientId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({ message: 'El ID del cliente no tiene un formato válido' });
    }

    const requests = await ServiceRequest.find({ clientId })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ServiceRequest.countDocuments({ clientId });

    res.json({
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      requests,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las solicitudes', error });
  }
});

// Eliminar una solicitud de servicio por ID
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'El ID de la solicitud no tiene un formato válido' });
    }

    // Verificar que el usuario tiene permiso para eliminar la solicitud
    const request = await ServiceRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    if (req.user.role !== 'admin' && req.user.id !== request.clientId.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta solicitud' });
    }

    await request.deleteOne();

    res.json({ message: 'Solicitud eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la solicitud', error });
  }
});

module.exports = router;
