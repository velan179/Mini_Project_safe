import mongoose from 'mongoose';

const bloodBankSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Bank name is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
    },
    location: {
      latitude: Number,
      longitude: Number,
      address: String,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    email: String,
    website: String,
    operatingHours: {
      monday: String,
      tuesday: String,
      wednesday: String,
      thursday: String,
      friday: String,
      saturday: String,
      sunday: String,
    },
    inventory: [
      {
        bloodGroup: {
          type: String,
          enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
        },
        units: Number,
        lastUpdated: Date,
      },
    ],
    services: [String], // e.g., ['blood-donation', 'blood-test', 'plasma-donation']
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        rating: Number,
        comment: String,
        date: Date,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for faster queries
bloodBankSchema.index({ city: 1 });
bloodBankSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });

export default mongoose.model('BloodBank', bloodBankSchema);
