import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../i18n/useTranslation';
import LanguageSwitcher from '../../common/LanguageSwitcher/LanguageSwitcher';
import Button from '../../common/Button/Button';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('adminToken');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/">{t('navigation.home')}</Link>
        </div>
        <nav className={styles.nav}>
          {!isAdmin && (
            <>
              <Link to="/upload-result">{t('navigation.addResult')}</Link>
              <Link to="/view-results">{t('navigation.viewResult')}</Link>
              <div className={styles.kuldevi}>
                || કુળદેવી આઈ શ્રી ખોડીયાર માતાજી ||
              </div>
            </>
          )}
          {isAdmin && (
            <>
              <Link to="/admin">{t('navigation.adminDashboard')}</Link>
              <Link to="/admin/manage-villages">{t('navigation.addVillage')}</Link>
              <Link to="/admin/manage-standards">{t('navigation.manageStandards')}</Link>
              <Link to="/admin/manage-results">{t('navigation.manageResults')}</Link>
              <Link to="/admin/top-three">{t('navigation.topThree')}</Link>
              <Link to="/admin/view-reports">{t('navigation.viewReports')}</Link>
              <div className={styles.kuldevi}>
                || કુળદેવી આઈ શ્રી ખોડીયાર માતાજી ||
              </div>
              <Button variant="danger" size="small" onClick={handleLogout}>
                {t('navigation.logout')}
              </Button>
            </>
          )}
           
        </nav>
        <div className={styles.rightSection}>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;

