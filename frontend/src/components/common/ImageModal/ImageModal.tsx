import React from 'react';
import styles from './ImageModal.module.css';

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
  alt?: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose, alt = 'Result image' }) => {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modal} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <img src={imageUrl} alt={alt} className={styles.image} />
      </div>
    </div>
  );
};

export default ImageModal;

