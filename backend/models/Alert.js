import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Alert title is required'],
    },
    description: String,
    location: {
      latitude: Number,
      longitude: Number,
      city: String,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    type: {
      type: String,
      enum: ['safety-warning', 'weather', 'event', 'incident'],
    },
    status: {
      type: String,
      enum: ['active', 'resolved'],
      default: 'active',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster queries
alertSchema.index({ timestamp: -1 });
alertSchema.index({ type: 1, status: 1 });

export default mongoose.model('Alert', alertSchema);
