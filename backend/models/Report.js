import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Report title is required'],
    },
    description: {
      type: String,
      required: [true, 'Report description is required'],
    },
    location: {
      latitude: Number,
      longitude: Number,
      city: String,
    },
    reportType: {
      type: String,
      enum: ['safety-concern', 'incident', 'scam-alert', 'missing-person', 'other'],
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    evidence: [String], // File paths
    status: {
      type: String,
      enum: ['pending', 'verified', 'resolved', 'rejected'],
      default: 'pending',
    },
    verifiedBy: mongoose.Schema.Types.ObjectId,
    likes: {
      type: Number,
      default: 0,
    },
    isAnonymous: {
      type: Boolean,
      default: true,
    },
    reportedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster queries
reportSchema.index({ reportedAt: -1 });
reportSchema.index({ reportType: 1, status: 1 });

export default mongoose.model('Report', reportSchema);
