import AsyncStorage from '@react-native-async-storage/async-storage';
import { PropertyFormData } from '../types/propertyform';

const STORAGE_KEY = 'PROPERTY_FORM_DATA';

export const saveFormData = async (data: PropertyFormData) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving form data:', error);
  }
};

export const loadFormData = async (): Promise<PropertyFormData | null> => {
  try {
    const savedData = await AsyncStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error('Error loading form data:', error);
    return null;
  }
};

export const clearFormData = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing form data:', error);
  }
};
