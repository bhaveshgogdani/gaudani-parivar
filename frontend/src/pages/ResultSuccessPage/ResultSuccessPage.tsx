import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../../i18n/useTranslation';
import Layout from '../../components/layout/Layout';
import Button from '../../components/common/Button/Button';
import styles from './ResultSuccessPage.module.css';

const ResultSuccessPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const contactNumber = location.state?.contactNumber || '';

  const handleViewResults = () => {
    navigate('/view-results', { state: { contactNumber } });
  };

  const handleAddAnother = () => {
    navigate('/upload-result');
  };

  return (
    <Layout>
      <div className={styles.successPage}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.title}>{t('pages.success.title')}</h1>
          <p className={styles.message}>
            {t('pages.success.message')}
          </p>
          {contactNumber && (
            <p className={styles.contactInfo}>
              {t('pages.success.mobileNumber')}: <strong>{contactNumber}</strong>
            </p>
          )}
          <div className={styles.actions}>
            <Button variant="primary" onClick={handleViewResults}>
              {t('pages.success.viewUploadedResults')}
            </Button>
            <Button variant="secondary" onClick={handleAddAnother}>
              {t('pages.success.addAnotherResult')}
            </Button>
            <Button variant="success" onClick={() => navigate('/')}>
              {t('pages.success.goToHome')}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResultSuccessPage;

