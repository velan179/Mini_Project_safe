import mongoose from 'mongoose';

const sosAlertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Alert title is required'],
    },
    description: String,
    location: {
      latitude: Number,
      longitude: Number,
      city: String,
      country: String,
      address: String,
    },
    alertType: {
      type: String,
      enum: ['medical-emergency', 'crime', 'accident', 'lost-person', 'natural-disaster', 'other'],
      required: [true, 'Alert type is required'],
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['active', 'resolved', 'cancelled'],
      default: 'active',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    photoUrl: String,
    audioUrl: String,
    videoUrl: String,
    contacts: [
      {
        contactId: mongoose.Schema.Types.ObjectId,
        name: String,
        phone: String,
        notifiedAt: Date,
        status: String, // 'pending', 'sent', 'acknowledged'
      },
    ],
    respondents: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        respondedAt: Date,
        action: String,
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
    tags: [String],
  },
  { timestamps: true }
);

// Index for faster queries
sosAlertSchema.index({ userId: 1 });
sosAlertSchema.index({ timestamp: -1 });
sosAlertSchema.index({ status: 1, severity: 1 });
sosAlertSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });

export default mongoose.model('SOSAlert', sosAlertSchema);
