import React, { createContext, useContext, useState, useEffect } from 'react';
import { authStorage } from './storage';
import uzDict from '../../../../packages/i18n/uz.json';
import ruDict from '../../../../packages/i18n/ru.json';

type Locale = 'uz' | 'ru';

interface I18nContextType {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: 'uz',
  setLocale: () => {},
  t: (k) => k,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('uz');

  useEffect(() => {
    authStorage.getLocale().then((saved) => {
      if (saved === 'ru' || saved === 'uz') {
        setLocaleState(saved);
      }
    });
  }, []);

  const setLocale = (newLoc: Locale) => {
    setLocaleState(newLoc);
    authStorage.setLocale(newLoc);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const dict = locale === 'ru' ? ruDict : uzDict;
    const parts = key.split('.');
    let val: any = dict;
    for (const p of parts) {
      if (!val || typeof val !== 'object') break;
      val = val[p];
    }
    if (typeof val !== 'string') return key;

    if (params) {
      return Object.entries(params).reduce((acc, [k, v]) => {
        return acc.replace(new RegExp(`{${k}}`, 'g'), String(v));
      }, val);
    }
    return val;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
