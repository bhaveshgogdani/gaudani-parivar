import mongoose from 'mongoose';

const VillageSchema = new mongoose.Schema(
  {
    villageName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 2,
      maxlength: 100,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
VillageSchema.index({ villageName: 1 });
VillageSchema.index({ isActive: 1 });

export default mongoose.model('Village', VillageSchema);

