const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const contractorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'is invalid']
  },
  phone: { 
    type: String, 
    required: true, 
    trim: true, 
    match: [/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, 'is invalid'] 
  },
  specialty: { type: [String], required: true },
  location: { type: String, required: true, trim: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  contact: { type: String, required: true, trim: true },
  priceRange: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

contractorSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

module.exports = mongoose.model('Contractor', contractorSchema);

