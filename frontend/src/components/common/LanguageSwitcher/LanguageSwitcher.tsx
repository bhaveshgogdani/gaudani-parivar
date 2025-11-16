import React from 'react';
import { useTranslation } from '../../../i18n/useTranslation';
import { supportedLanguages } from '../../../i18n/languageConfig';
import styles from './LanguageSwitcher.module.css';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  return (
    <div className={styles.languageSwitcher}>
      <select
        value={language}
        onChange={handleLanguageChange}
        className={styles.select}
        aria-label="Language selector"
      >
        {supportedLanguages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;

