import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
  colors: typeof darkColors;
  themeVersion: number;
}

const darkColors = {
  bg:'#0f0f1a', bg2:'#1a1a2e', bg3:'#252540',
  text:'#ffffff', text2:'rgba(255,255,255,0.7)', text3:'rgba(255,255,255,0.4)',
  glass:'rgba(255,255,255,0.06)', glassBorder:'rgba(255,255,255,0.1)',
  card:'rgba(255,255,255,0.05)', input:'rgba(255,255,255,0.05)', inputBorder:'rgba(255,255,255,0.1)',
  primary:'#10b981', success:'#10b981', warning:'#f59e0b', error:'#ef4444',
};

const lightColors = {
  bg:'#eef1f6', bg2:'#ffffff', bg3:'#e2e6ee',
  text:'#1a1a2e', text2:'rgba(26,26,46,0.7)', text3:'rgba(26,26,46,0.45)',
  glass:'#ffffff', glassBorder:'rgba(0,0,0,0.14)',
  card:'#ffffff', input:'#ffffff', inputBorder:'rgba(0,0,0,0.16)',
  primary:'#10b981', success:'#10b981', warning:'#f59e0b', error:'#ef4444',
};

const ThemeContext = createContext<ThemeContextType>({
  theme:'dark', toggleTheme:()=>{}, isDark:true, colors:darkColors, themeVersion:0,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [themeVersion, setThemeVersion] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem('app-theme').then(t => {
      if (t === 'light' || t === 'dark') setTheme(t);
    });
  }, []);

  const toggleTheme = async () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    setThemeVersion(v => v + 1);
    await AsyncStorage.setItem('app-theme', next);
  };

  const value = useMemo(() => ({
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    colors: theme === 'dark' ? darkColors : lightColors,
    themeVersion,
  }), [theme, themeVersion]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
export { darkColors, lightColors };
