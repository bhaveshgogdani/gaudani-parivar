import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../../../i18n/useTranslation';
import LanguageSwitcher from '../../common/LanguageSwitcher/LanguageSwitcher';
import Button from '../../common/Button/Button';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = localStorage.getItem('adminToken');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isHomePage = location.pathname === '/';

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside or on a link
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest(`.${styles.mobileMenu}`) && !target.closest(`.${styles.menuToggle}`)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent body scroll when menu is open
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/" onClick={closeMenu}>{t('navigation.home')}</Link>
        </div>
        
        {/* Hamburger Menu Button - Mobile Only */}
        <button 
          className={styles.menuToggle}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerOpen : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          {!isAdmin && (
            <>
              {!isHomePage && <Link to="/upload-result">{t('navigation.addResult')}</Link>}
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
              <Link to="/admin/settings" className={styles.settingsLink} title={t('navigation.settings')}>
                ⚙️
              </Link>
              <div className={styles.kuldevi}>
                || કુળદેવી આઈ શ્રી ખોડીયાર માતાજી ||
              </div>
              <Button variant="danger" size="small" onClick={handleLogout}>
                {t('navigation.logout')}
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Slide-in Menu */}
        <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
          <div className={styles.mobileMenuContent}>
            <div className={styles.mobileLanguageSwitcher}>
              <label className={styles.languageLabel}>તમારી ભાષા પસંદ કરો</label>
              <LanguageSwitcher />
            </div>
            <nav className={styles.mobileNav}>
              {!isAdmin && (
                <>
                  {!isHomePage && <Link to="/upload-result" onClick={closeMenu}>{t('navigation.addResult')}</Link>}
                  <Link to="/view-results" onClick={closeMenu}>{t('navigation.viewResult')}</Link>
                  <div className={styles.mobileKuldevi}>
                    || કુળદેવી આઈ શ્રી ખોડીયાર માતાજી ||
                  </div>
                </>
              )}
              {isAdmin && (
                <>
                  <Link to="/admin" onClick={closeMenu}>{t('navigation.adminDashboard')}</Link>
                  <Link to="/admin/manage-villages" onClick={closeMenu}>{t('navigation.addVillage')}</Link>
                  <Link to="/admin/manage-standards" onClick={closeMenu}>{t('navigation.manageStandards')}</Link>
                  <Link to="/admin/manage-results" onClick={closeMenu}>{t('navigation.manageResults')}</Link>
                  <Link to="/admin/top-three" onClick={closeMenu}>{t('navigation.topThree')}</Link>
                  <Link to="/admin/view-reports" onClick={closeMenu}>{t('navigation.viewReports')}</Link>
                  <Link to="/admin/settings" onClick={closeMenu} className={styles.mobileSettingsLink}>
                    ⚙️ {t('navigation.settings')}
                  </Link>
                  <div className={styles.mobileKuldevi}>
                    || કુળદેવી આઈ શ્રી ખોડીયાર માતાજી ||
                  </div>
                  <Button variant="danger" size="small" onClick={handleLogout} className={styles.mobileLogoutButton}>
                    {t('navigation.logout')}
                  </Button>
                </>
              )}
            </nav>
          </div>
        </div>

        {/* Overlay/Backdrop */}
        {isMenuOpen && (
          <div className={styles.overlay} onClick={closeMenu}></div>
        )}

        {/* Desktop Right Section */}
        <div className={styles.rightSection}>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;

