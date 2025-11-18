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
  const isOpeningRef = useRef<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Reset the flag when file changes
    isOpeningRef.current = false;
    
    const file = e.target.files?.[0] || null;

    if (file) {
      if (file.size > maxSize) {
        alert(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
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

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setPreview(null);
    onChange(null);
  };

  const handleUploadAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent double triggers
    if (isOpeningRef.current) {
      e.stopPropagation();
      return;
    }
    
    // Don't trigger if clicking the remove button
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }
    
    // Stop propagation to avoid event bubbling issues
    e.stopPropagation();
    
    // Set flag to prevent double triggers
    isOpeningRef.current = true;
    
    // Programmatically trigger the file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    
    // Reset flag after a short delay
    setTimeout(() => {
      isOpeningRef.current = false;
    }, 300);
  };

  return (
    <div className={styles.fileUploadWrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.uploadArea} onClick={handleUploadAreaClick}>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className={styles.fileInput}
        />
        <div className={styles.fileLabel}>
          {value ? value.name : 'Choose file or drag and drop'}
        </div>
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
