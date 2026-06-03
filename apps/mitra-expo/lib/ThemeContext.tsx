import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
  colors: typeof darkColors;
}

const darkColors = {
  bg:          '#0f0f1a',
  bg2:         '#1a1a2e',
  bg3:         '#252540',
  text:        '#ffffff',
  text2:       'rgba(255,255,255,0.7)',
  text3:       'rgba(255,255,255,0.4)',
  glass:       'rgba(255,255,255,0.06)',
  glassBorder: 'rgba(255,255,255,0.1)',
  card:        'rgba(255,255,255,0.05)',
  input:       'rgba(255,255,255,0.05)',
  inputBorder: 'rgba(255,255,255,0.1)',
  primary:     '#7c3aed',
  success:     '#10b981',
  warning:     '#f59e0b',
  error:       '#ef4444',
};

const lightColors = {
  bg:          '#f8f9fa',
  bg2:         '#ffffff',
  bg3:         '#f0f0f5',
  text:        '#1a1a2e',
  text2:       'rgba(26,26,46,0.7)',
  text3:       'rgba(26,26,46,0.4)',
  glass:       'rgba(0,0,0,0.04)',
  glassBorder: 'rgba(0,0,0,0.08)',
  card:        '#ffffff',
  input:       '#ffffff',
  inputBorder: 'rgba(0,0,0,0.12)',
  primary:     '#7c3aed',
  success:     '#10b981',
  warning:     '#f59e0b',
  error:       '#ef4444',
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark', toggleTheme: ()=>{}, isDark: true, colors: darkColors,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    AsyncStorage.getItem('app-theme').then(t => {
      if (t === 'light' || t === 'dark') setTheme(t);
    });
  }, []);

  const toggleTheme = async () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    await AsyncStorage.setItem('app-theme', next);
  };

  const colors = theme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme==='dark', colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
export { darkColors, lightColors };
