const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, 
  userType: { 
    type: String, 
    enum: ['Client', 'Contractor'], 
    required: true 
  }, 
  message: { 
    type: String, 
    required: true 
  }, 
  type: { 
    type: String, 
    enum: ['assigned', 'status_change'], 
    required: true 
  }, 
  isRead: { 
    type: Boolean, 
    default: false 
  }, 
  createdAt: { 
    type: Date, 
    default: Date.now 
  } 
}, {
  timestamps: true,
});

module.exports = mongoose.model('Notification', notificationSchema);
