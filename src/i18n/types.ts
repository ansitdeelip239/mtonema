export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  isRTL?: boolean; // Added for RTL support
  isHidden?: boolean; // Added to hide languages from selection
}

export interface LanguageDetector {
  type: 'languageDetector';
  async: boolean;
  detect: (callback: (lng: string) => void) => void;
  init: () => void;
  cacheUserLanguage: (lng: string) => void;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English', isRTL: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', isRTL: false },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', isRTL: false },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', isRTL: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', isRTL: true, isHidden: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', isRTL: false, isHidden: true },
];

export type SupportedLanguageCode = 'en' | 'es' | 'pt' | 'am' | 'ar' | 'hi';
