import mongoose from 'mongoose';

export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const validatePhoneNumber = (phone) => {
  return /^[0-9]{10}$/.test(phone);
};

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateMedium = (medium) => {
  return medium === 'gujarati' || medium === 'english';
};

export const validatePercentage = (percentage) => {
  return percentage >= 0 && percentage <= 100;
};

export const validateMarks = (obtained, total) => {
  return obtained >= 0 && obtained <= total;
};

