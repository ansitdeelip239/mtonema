import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors';

// Define theme interface
interface Theme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
}

// Define context interface
interface ThemeContextType {
  theme: Theme;
  updateTheme: (theme: Theme) => Promise<void>;
}

// Default theme
const defaultTheme: Theme = {
  primaryColor: Colors.MT_PRIMARY_1,
  secondaryColor: Colors.MT_PRIMARY_2,
  backgroundColor: Colors.MT_SECONDARY_3,
  textColor: Colors.MT_SECONDARY_1,
};

// Create context with proper types
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'APP_THEME';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  // Load theme from AsyncStorage on mount
  useEffect(() => {
    const loadTheme = async (): Promise<void> => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (storedTheme) {
          const parsedTheme = JSON.parse(storedTheme) as Theme;
          setTheme(parsedTheme);
        }
      } catch (err) {
        console.error('Failed to load theme', err);
        // Fallback to default theme on error
        setTheme(defaultTheme);
      }
    };

    loadTheme();
  }, []);

  // Update theme and persist to AsyncStorage
  const updateTheme = async (newTheme: Theme): Promise<void> => {
    try {
      setTheme(newTheme);
      await AsyncStorage.setItem(THEME_KEY, JSON.stringify(newTheme));
    } catch (err) {
      console.error('Failed to save theme', err);
      throw new Error('Failed to save theme');
    }
  };

  const contextValue: ThemeContextType = {
    theme,
    updateTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
