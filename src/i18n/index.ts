import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import zhTranslation from './locales/zh.json';
import enTranslation from './locales/en.json';
import jaTranslation from './locales/ja.json';

const resources = {
  zh: {
    translation: zhTranslation,
  },
  en: {
    translation: enTranslation,
  },
  ja: {
    translation: jaTranslation,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh', // Default to Chinese as requested
    lng: 'zh', // Start with Chinese
    debug: false,

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;