export const supportedLanguages = [
  { code: 'gu', name: 'ગુજરાતી', nativeName: 'ગુજરાતી' },
  { code: 'en', name: 'English', nativeName: 'English' },
];

export const defaultLanguage = 'gu';

export const getLanguageFromStorage = (): string => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('language');
    return stored && supportedLanguages.find((lang) => lang.code === stored)
      ? stored
      : defaultLanguage;
  }
  return defaultLanguage;
};

export const saveLanguageToStorage = (code: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', code);
  }
};

