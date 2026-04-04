import mongoose from 'mongoose';

const evidenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    type: {
      type: String,
      enum: ['photo', 'video', 'audio'],
      required: [true, 'Evidence type is required'],
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
    },
    filePath: {
      type: String,
      required: [true, 'File path is required'],
    },
    fileSize: {
      type: Number, // In bytes
    },
    mimeType: String,
    location: {
      latitude: Number,
      longitude: Number,
      city: String,
      country: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    description: String,
    tags: [String],
    isPublic: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Index for faster queries
evidenceSchema.index({ userId: 1 });
evidenceSchema.index({ timestamp: -1 });

export default mongoose.model('Evidence', evidenceSchema);
