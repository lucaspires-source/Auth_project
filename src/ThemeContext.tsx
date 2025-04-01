import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline  } from "@mui/material";
import { ReactNode, createContext, useContext, useState } from "react";

type ThemeContextType = {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
  };
  
  const ThemeContext = createContext<ThemeContextType>(null!);
  
  export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<'light' | 'dark'>(
      (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
    );
  
    const toggleTheme = () => {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      setTheme(newTheme);
    };
  
    const themeConfig = createTheme({
      palette: {
        mode: theme,
      },
    });
  
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <MuiThemeProvider theme={themeConfig}>
          <CssBaseline />
          {children}
        </MuiThemeProvider>
      </ThemeContext.Provider>
    );
  }

  export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
      throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
  };