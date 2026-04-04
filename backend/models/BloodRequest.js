import mongoose from 'mongoose';

const bloodRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
    },
    bloodGroup: {
      type: String,
      enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
      required: [true, 'Blood group is required'],
    },
    unitsNeeded: {
      type: Number,
      required: [true, 'Number of units is required'],
      min: 1,
    },
    hospital: {
      type: String,
      required: [true, 'Hospital name is required'],
    },
    location: {
      latitude: Number,
      longitude: Number,
      city: String,
    },
    phone: {
      type: String,
      required: [true, 'Contact phone is required'],
    },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    reason: String,
    status: {
      type: String,
      enum: ['pending', 'fulfilled', 'cancelled', 'expired'],
      default: 'pending',
    },
    requestDate: {
      type: Date,
      default: Date.now,
    },
    neededBy: Date,
    responses: [
      {
        donorId: mongoose.Schema.Types.ObjectId,
        units: Number,
        responseDate: Date,
        status: String, // 'accepted', 'declined'
      },
    ],
    totalUnitsReceived: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for faster queries
bloodRequestSchema.index({ userId: 1 });
bloodRequestSchema.index({ bloodGroup: 1, status: 1 });
bloodRequestSchema.index({ requestDate: -1 });

export default mongoose.model('BloodRequest', bloodRequestSchema);
