import { useState, useCallback } from 'react';
import { validateFileType, validateFileSize } from '../utils/validators';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '../utils/constants';

export interface UseFileUploadOptions {
  maxSize?: number;
  allowedTypes?: string[];
  onError?: (error: string) => void;
}

export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const {
    maxSize = MAX_FILE_SIZE,
    allowedTypes = ALLOWED_FILE_TYPES,
    onError,
  } = options;

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(
    (selectedFile: File | null) => {
      if (!selectedFile) {
        setFile(null);
        setPreview(null);
        setError(null);
        return;
      }

      // Validate file type
      if (!validateFileType(selectedFile, allowedTypes)) {
        const errorMsg = `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`;
        setError(errorMsg);
        if (onError) onError(errorMsg);
        return;
      }

      // Validate file size
      if (!validateFileSize(selectedFile, maxSize)) {
        const errorMsg = `File size exceeds ${maxSize / 1024 / 1024}MB limit`;
        setError(errorMsg);
        if (onError) onError(errorMsg);
        return;
      }

      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.onerror = () => {
          setError('Error reading file');
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }

      setFile(selectedFile);
      setError(null);
    },
    [maxSize, allowedTypes, onError]
  );

  const clearFile = useCallback(() => {
    setFile(null);
    setPreview(null);
    setError(null);
  }, []);

  return {
    file,
    preview,
    error,
    handleFileSelect,
    clearFile,
  };
};

