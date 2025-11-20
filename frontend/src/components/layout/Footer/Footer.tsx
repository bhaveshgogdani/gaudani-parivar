import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.kuldevi}>|| કુળદેવી આઈ શ્રી ખોડીયાર માતાજી ||</p>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} ગૌદાની પરિવાર. બધા અધિકારો સુરક્ષિત.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

