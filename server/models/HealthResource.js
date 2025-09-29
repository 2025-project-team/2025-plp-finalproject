import mongoose from 'mongoose';

const healthResourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['hospital', 'clinic', 'pharmacy', 'urgent-care', 'specialist']
  },
  location: {
    address: String,
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  services: [String],
  waitTime: String,
  distance: String,
  available: {
    type: Boolean,
    default: true
  },
  operatingHours: {
    open: String,
    close: String,
    timezone: String
  }
}, {
  timestamps: true
});

healthResourceSchema.index({ 'location.coordinates': '2dsphere' });

export default mongoose.model('HealthResource', healthResourceSchema);