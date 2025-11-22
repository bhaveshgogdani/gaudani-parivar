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
      required: false,
    },
    otherStandardName: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 100,
      required: false,
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
      required: true,
      trim: true,
      match: /^[0-9]{10}$/,
    },
    resultImageUrl: {
      type: String,
      required: true,
    },
    resultImageFileName: {
      type: String,
      required: true,
    },
    resultImage2Url: {
      type: String,
      required: false,
    },
    resultImage2FileName: {
      type: String,
      required: false,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Custom validation: Either standardId or otherStandardName must be provided
ResultSchema.pre('validate', function(next) {
  if (!this.standardId && !this.otherStandardName) {
    this.invalidate('standardId', 'Either standard or other standard name is required');
    this.invalidate('otherStandardName', 'Either standard or other standard name is required');
  }
  if (this.standardId && this.otherStandardName) {
    this.invalidate('standardId', 'Cannot provide both standard and other standard name');
    this.invalidate('otherStandardName', 'Cannot provide both standard and other standard name');
  }
  next();
});

// Indexes for better query performance
ResultSchema.index({ standardId: 1 });
ResultSchema.index({ villageId: 1 });
ResultSchema.index({ medium: 1 });
ResultSchema.index({ percentage: -1 });
ResultSchema.index({ studentName: 1 });

export default mongoose.model('Result', ResultSchema);

