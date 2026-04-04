import mongoose from 'mongoose';

const bloodDonorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    bloodGroup: {
      type: String,
      enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
      required: [true, 'Blood group is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    lastDonationDate: Date,
    nextEligibleDate: Date, // 3 months after last donation
    isAvailable: {
      type: Boolean,
      default: true,
    },
    donationHistory: [
      {
        date: Date,
        location: String,
        units: Number,
      },
    ],
    totalDonations: {
      type: Number,
      default: 0,
    },
    healthStatus: String,
  },
  { timestamps: true }
);

// Index for faster queries
bloodDonorSchema.index({ bloodGroup: 1, city: 1 });
bloodDonorSchema.index({ isAvailable: 1 });

export default mongoose.model('BloodDonor', bloodDonorSchema);
