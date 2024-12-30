const express = require('express');
const mongoose = require('mongoose');
const Notification = require('../models/Notification');

const router = express.Router();

// Listar notificaciones con paginación
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'El ID del usuario no tiene un formato válido' });
    }

    const notifications = await Notification.find({ userId })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 }); // Ordenar por la fecha más reciente

    const total = await Notification.countDocuments({ userId });

    res.json({
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      notifications,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las notificaciones', error });
  }
});

// Marcar una notificación como leída
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'El ID de la notificación no tiene un formato válido' });
    }

    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: 'Notificación no encontrada' });
    }

    res.json(updatedNotification);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la notificación', error });
  }
});

module.exports = router;
