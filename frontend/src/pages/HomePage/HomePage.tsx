import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/useTranslation';
import Button from '../../components/common/Button/Button';
import Layout from '../../components/layout/Layout';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className={styles.homePage}>
        <h1 className={styles.title}>{t('pages.home.title')}</h1>
        <p className={styles.welcome}>{t('pages.home.welcome')}</p>
        <p className={styles.instructions}>{t('pages.home.instructions')}</p>
        <div className={styles.actions}>
          <Button
            variant="primary"
            size="large"
            onClick={() => navigate('/upload-result')}
          >
            {t('pages.home.uploadResult')}
          </Button>
          <Button
            variant="success"
            size="large"
            onClick={() => navigate('/view-results')}
          >
            {t('pages.home.viewResults')}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;

