import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import commonKo from './locales/ko/common.json';
import commonEn from './locales/en/common.json';
import homeKo from './locales/ko/home.json';
import homeEn from './locales/en/home.json';
import aboutKo from './locales/ko/about.json';
import aboutEn from './locales/en/about.json';
import cultureKo from './locales/ko/culture.json';
import cultureEn from './locales/en/culture.json';
import careerKo from './locales/ko/career.json';
import careerEn from './locales/en/career.json';
import partnerKo from './locales/ko/partner.json';
import partnerEn from './locales/en/partner.json';
import productKo from './locales/ko/product.json';
import productEn from './locales/en/product.json';
import newsKo from './locales/ko/news.json';
import newsEn from './locales/en/news.json';
import irKo from './locales/ko/ir.json';
import irEn from './locales/en/ir.json';
import adminKo from './locales/ko/admin.json';
import adminEn from './locales/en/admin.json';

const resources = {
  ko: {
    common: commonKo,
    home: homeKo,
    about: aboutKo,
    culture: cultureKo,
    career: careerKo,
    partner: partnerKo,
    product: productKo,
    news: newsKo,
    ir: irKo,
    admin: adminKo,
  },
  en: {
    common: commonEn,
    home: homeEn,
    about: aboutEn,
    culture: cultureEn,
    career: careerEn,
    partner: partnerEn,
    product: productEn,
    news: newsEn,
    ir: irEn,
    admin: adminEn,
  },
};

i18n
  .use(LanguageDetector) // 브라우저 언어 자동 감지
  .use(initReactI18next) // React i18next 연결
  .init({
    resources,
    fallbackLng: 'ko', // 기본 언어
    defaultNS: 'common', // 기본 네임스페이스
    ns: ['common', 'home', 'about', 'culture', 'career', 'partner', 'product', 'news', 'ir', 'admin'],
    interpolation: {
      escapeValue: false, // React는 XSS 보호가 내장되어 있음
    },
    detection: {
      order: ['localStorage', 'navigator'], // 저장된 언어 우선, 그 다음 브라우저 언어
      caches: ['localStorage'], // localStorage에 언어 설정 저장
    },
  });

export default i18n;

