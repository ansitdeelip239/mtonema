// formvalidation.ts

export const validateName = (name: string): boolean => {
  return name.trim().length > 0 && /^[a-zA-Z\s]+$/.test(name);
};
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+91-\d{10}$/; // Requires exactly 10 digits after +91-
  return phoneRegex.test(phone);
};

export const validateLocation = (location: string): boolean => {
  return location.trim().length > 0; // Ensures the location is not empty
};

