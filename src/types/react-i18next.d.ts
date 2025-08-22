import 'i18next';
import Resources from './resources';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    resources: Resources;
  }
}
