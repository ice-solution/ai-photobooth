const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  voiceText: {
    type: String,
    default: ''
  },
  profession: {
    type: String,
    default: ''
  },
  userPhoto: {
    type: String,
    default: ''
  },
  gender: {
    type: String,
    default: '',
    required: false
  },
  generatedPhoto: {
    type: String,
    default: ''
  },
  finalPhoto: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['voice', 'photo', 'generating', 'faceswapping', 'completed', 'error'],
    default: 'voice'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);
