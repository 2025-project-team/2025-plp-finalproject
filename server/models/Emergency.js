import mongoose from "mongoose";

const emergencySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["cardiac", "respiratory", "trauma", "allergy", "stroke", "seizure", "unconscious", "bleeding", "other"]
  },
  severity: {
    type: String,
    required: true,
    enum: ["low", "medium", "high"]
  },
  location: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  description: {
    type: String,
    required: true
  },
  reporter: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false  // Changed from required: true
    },
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: false
    }
  },
  status: {
    type: String,
    enum: ["reported", "dispatched", "in-progress", "resolved", "cancelled"],
    default: "reported"
  },
  responders: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    name: String,
    role: String,
    status: {
      type: String,
      enum: ["dispatched", "on-scene", "completed"],
      default: "dispatched"
    }
  }],
  numberOfPeople: {
    type: Number,
    default: 1,
    min: 1
  },
  images: [String],
  resolvedAt: Date
}, {
  timestamps: true
});

// Index for geospatial queries
emergencySchema.index({ "location.coordinates": "2dsphere" });

// Virtual for active emergencies
emergencySchema.virtual("isActive").get(function() {
  return this.status !== "resolved" && this.status !== "cancelled";
});

export default mongoose.model("Emergency", emergencySchema);
