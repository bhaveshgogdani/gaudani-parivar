export const validatePhoneNumber = (phone: string): boolean => {
  return /^[0-9]{10}$/.test(phone);
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize;
};

export const validatePercentage = (percentage: number): boolean => {
  return percentage >= 0 && percentage <= 100;
};

export const validateMarks = (obtained: number, total: number): boolean => {
  return obtained >= 0 && obtained <= total;
};

