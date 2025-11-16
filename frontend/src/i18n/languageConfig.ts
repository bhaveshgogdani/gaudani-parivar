export const supportedLanguages = [
  { code: 'gu', name: 'ગુજરાતી', nativeName: 'ગુજરાતી' },
  { code: 'en', name: 'English', nativeName: 'English' },
];

export const defaultLanguage = 'gu';

export const getLanguageFromStorage = (): string => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('language');
    // If no language is stored or stored language is invalid, return default (Gujarati)
    if (!stored || !supportedLanguages.find((lang) => lang.code === stored)) {
      return defaultLanguage; // Gujarati is the default
    }
    return stored;
  }
  return defaultLanguage; // Gujarati is the default
};

export const saveLanguageToStorage = (code: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', code);
  }
};

