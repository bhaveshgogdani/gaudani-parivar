import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { defaultLanguage, getLanguageFromStorage, saveLanguageToStorage } from '../i18n/languageConfig';
import guTranslations from '../i18n/languages/gu.json';
import enTranslations from '../i18n/languages/en.json';

type Translations = typeof guTranslations;

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  translations: Translations;
}

const translationsMap: Record<string, Translations> = {
  gu: guTranslations,
  en: enTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(getLanguageFromStorage());

  useEffect(() => {
    saveLanguageToStorage(language);
    // Update HTML lang attribute
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translationsMap[language] || translationsMap[defaultLanguage];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to default language
        value = translationsMap[defaultLanguage];
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if translation not found
          }
        }
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translations: translationsMap[language] || translationsMap[defaultLanguage],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

