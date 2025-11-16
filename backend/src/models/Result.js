import mongoose from 'mongoose';

const ResultSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    standardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Standard',
      required: true,
    },
    medium: {
      type: String,
      required: true,
      enum: ['gujarati', 'english'],
    },
    totalMarks: {
      type: Number,
      min: 1,
      max: 10000,
    },
    obtainedMarks: {
      type: Number,
      min: 0,
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    villageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Village',
      required: true,
    },
    contactNumber: {
      type: String,
      trim: true,
      match: /^[0-9]{10}$/,
    },
    resultImageUrl: {
      type: String,
    },
    resultImageFileName: {
      type: String,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
ResultSchema.index({ standardId: 1 });
ResultSchema.index({ villageId: 1 });
ResultSchema.index({ medium: 1 });
ResultSchema.index({ percentage: -1 });
ResultSchema.index({ studentName: 1 });

export default mongoose.model('Result', ResultSchema);

