import React, { useState } from 'react';
import styles from './ImageModal.module.css';

interface ImageModalProps {
  imageUrl: string;
  imageUrl2?: string;
  onClose: () => void;
  alt?: string;
  alt2?: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ 
  imageUrl, 
  imageUrl2, 
  onClose, 
  alt = 'Result image',
  alt2 = 'Result image 2'
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = imageUrl2 ? [imageUrl, imageUrl2] : [imageUrl];
  const alts = imageUrl2 ? [alt, alt2] : [alt];

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePrevious = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrevious(e as any);
    } else if (e.key === 'ArrowRight') {
      handleNext(e as any);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className={styles.modal} 
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        
        {images.length > 1 && (
          <>
            <button 
              className={styles.navButton} 
              onClick={handlePrevious}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button 
              className={`${styles.navButton} ${styles.navButtonRight}`} 
              onClick={handleNext}
              aria-label="Next image"
            >
              ›
            </button>
            <div className={styles.imageCounter}>
              {currentImageIndex + 1} / {images.length}
            </div>
            <div className={styles.imageIndicators}>
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.indicator} ${index === currentImageIndex ? styles.active : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        <div className={styles.imageContainer}>
          {images.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={alts[index]}
              className={`${styles.image} ${index === currentImageIndex ? styles.active : styles.hidden}`}
            />
          ))}
        </div>

        {images.length > 1 && (
          <div className={styles.imageLabel}>
            Image {currentImageIndex + 1} {currentImageIndex === 0 ? '(Main)' : '(Additional)'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageModal;

