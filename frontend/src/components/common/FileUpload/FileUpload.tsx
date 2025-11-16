import React, { useRef, useState } from 'react';
import styles from './FileUpload.module.css';

interface FileUploadProps {
  label?: string | React.ReactNode;
  accept?: string;
  maxSize?: number; // in bytes
  onChange: (file: File | null) => void;
  error?: string;
  value?: File | null;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept = 'image/*,application/pdf',
  maxSize = 5 * 1024 * 1024, // 5MB default
  onChange,
  error,
  value,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      if (file.size > maxSize) {
        alert(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
        return;
      }

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    } else {
      setPreview(null);
    }

    onChange(file);
  };

  const handleRemove = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setPreview(null);
    onChange(null);
  };

  return (
    <div className={styles.fileUploadWrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.uploadArea}>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className={styles.fileInput}
          id="file-upload"
        />
        <label htmlFor="file-upload" className={styles.fileLabel}>
          {value ? value.name : 'Choose file or drag and drop'}
        </label>
        {value && (
          <button
            type="button"
            onClick={handleRemove}
            className={styles.removeButton}
          >
            Remove
          </button>
        )}
      </div>
      {preview && (
        <div className={styles.preview}>
          <img src={preview} alt="Preview" />
        </div>
      )}
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default FileUpload;

