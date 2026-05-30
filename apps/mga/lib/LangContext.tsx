'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Lang } from './i18n';

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
}

const LangContext = createContext<LangContextType>({
  lang: 'id',
  setLang: () => {},
  toggle: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('id');

  useEffect(() => {
    // Baca dari localStorage saat mount
    const saved = localStorage.getItem('mga-lang') as Lang;
    if (saved === 'id' || saved === 'en') setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('mga-lang', l);
  };

  const toggle = () => setLang(lang === 'id' ? 'en' : 'id');

  return (
    <LangContext.Provider value={{ lang, setLang, toggle }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
