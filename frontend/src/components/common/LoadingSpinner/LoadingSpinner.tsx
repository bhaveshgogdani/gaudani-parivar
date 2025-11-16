import React from 'react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium', fullScreen = false }) => {
  const spinnerClasses = [
    styles.spinner,
    styles[size],
    fullScreen && styles.fullScreen,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={spinnerClasses}>
      <div className={styles.loader}></div>
    </div>
  );
};

export default LoadingSpinner;

