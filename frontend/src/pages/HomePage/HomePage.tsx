import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/useTranslation';
import Layout from '../../components/layout/Layout';
import LanguageSwitcher from '../../components/common/LanguageSwitcher/LanguageSwitcher';
import Button from '../../components/common/Button/Button';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Layout showHeader={false} showFooter={true}>
      <div className={styles.homePage}>
        <div className={styles.languageSwitcher}>
          <LanguageSwitcher />
        </div>
        <div className={styles.headerSection}>
          <h1 className={styles.title}>{t('pages.home.title')}</h1>
          <div className={styles.kuldevi}>
            || કુળદેવી આઈ શ્રી ખોડીયાર માતાજી ||
          </div>
          <p className={styles.welcome}>{t('pages.home.welcome')}</p>
        </div>

        <div className={styles.instructionsSection}>
          <h2 className={styles.instructionsTitle}>{t('pages.home.instructionsTitle')}</h2>
          <p className={styles.instructionsParagraph}>{t('pages.home.instructionsParagraph')}</p>
        </div>

        <div className={styles.actionsSection}>
          <Button
            variant="primary"
            size="large"
            onClick={() => navigate('/upload-result')}
          >
            {t('pages.home.uploadResult')}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;

