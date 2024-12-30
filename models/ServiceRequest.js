const mongoose = require('mongoose');
const { Schema, model, Types: { ObjectId } } = mongoose;

const serviceRequestSchema = new Schema({
  clientId: { type: ObjectId, ref: 'Client', required: true },
  contractorId: { type: ObjectId, ref: 'Contractor', required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Pendiente', 'Aceptada', 'Rechazada', 'Completado'], 
    default: 'Pendiente',
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = model('ServiceRequest', serviceRequestSchema);
