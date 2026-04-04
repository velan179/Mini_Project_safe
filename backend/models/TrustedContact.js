import mongoose from 'mongoose';

const trustedContactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Please provide contact name'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
    },
    email: {
      type: String,
      lowercase: true,
    },
    relationship: {
      type: String,
      enum: ['Family', 'Friend', 'Colleague', 'Emergency Contact', 'Other'],
      default: 'Other',
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for faster queries
trustedContactSchema.index({ userId: 1 });

export default mongoose.model('TrustedContact', trustedContactSchema);
