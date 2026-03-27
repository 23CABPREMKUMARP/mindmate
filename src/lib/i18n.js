import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../locales/en.json';
import ta from '../locales/ta.json';
import ml from '../locales/ml.json';
import hi from '../locales/hi.json';
import te from '../locales/te.json';
import kn from '../locales/kn.json';

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        ta: { translation: ta },
        ml: { translation: ml },
        hi: { translation: hi },
        te: { translation: te },
        kn: { translation: kn }
      },
      fallbackLng: 'en',
      defaultNS: 'translation',
      ns: ['translation'],
      interpolation: {
        escapeValue: false
      },
      detection: {
        order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
        caches: ['localStorage']
      },
      react: {
        useSuspense: false
      }
    });
}

export default i18n;
