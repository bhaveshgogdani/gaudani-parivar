import mongoose from 'mongoose';

const StandardSchema = new mongoose.Schema(
  {
    standardName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    standardCode: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      uppercase: true,
    },
    displayOrder: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isCollegeLevel: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
StandardSchema.index({ standardCode: 1 });
StandardSchema.index({ displayOrder: 1 });
StandardSchema.index({ isActive: 1 });
StandardSchema.index({ isCollegeLevel: 1 });

export default mongoose.model('Standard', StandardSchema);

