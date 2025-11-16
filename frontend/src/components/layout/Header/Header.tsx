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
          <Link to="/">{t('navigation.home')}</Link>
          <Link to="/upload-result">{t('navigation.addResult')}</Link>
          {isAdmin && (
            <Link to="/admin/manage-villages">{t('navigation.addVillage')}</Link>
          )}
          <Link to="/view-results">{t('navigation.studentList')}</Link>
          <Link to="/top-three-ranking">{t('navigation.topThree')}</Link>
          <Link to="/event-information">{t('navigation.eventInfo')}</Link>
          {isAdmin && (
            <>
              <Link to="/admin">{t('navigation.adminDashboard')}</Link>
              <Button variant="danger" size="small" onClick={handleLogout}>
                {t('navigation.logout')}
              </Button>
            </>
          )}
        </nav>
        <div className={styles.rightSection}>
          <div className={styles.greeting}>
            Hello {isAdmin ? 'Admin' : 'User'}...!
          </div>
          <div className={styles.kuldevi}>
            || કુળદેવી આઈ શ્રી ખોડીયાર માતાજી ||
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;

