"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import uzJson from "../locales/uz.json";
import ruJson from "../locales/ru.json";

type Locale = "uz" | "ru";

interface LanguageContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "uz",
  setLocale: () => {},
  t: (key) => key
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>("uz");

  useEffect(() => {
    const saved = localStorage.getItem("uzsavdo_locale") as Locale;
    if (saved === "uz" || saved === "ru") {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("uzsavdo_locale", l);
  };

  const t = (key: string, params?: Record<string, any>): string => {
    const dict: any = locale === "uz" ? uzJson : ruJson;
    const parts = key.split(".");
    let val: any = dict;
    for (const p of parts) {
      if (val && typeof val === "object" && p in val) {
        val = val[p];
      } else {
        return key;
      }
    }
    if (typeof val === "string" && params) {
      let res = val;
      for (const [k, v] of Object.entries(params)) {
        res = res.replace(`{${k}}`, String(v));
      }
      return res;
    }
    return typeof val === "string" ? val : key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
