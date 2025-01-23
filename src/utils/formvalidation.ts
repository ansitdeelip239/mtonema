// formvalidation.ts

export const validateName = (name: string | undefined | null): boolean => {
  if (!name) {
    return false;
  }
  const trimmedName = name.trim();
  return trimmedName.length > 0 && /^[a-zA-Z\s]+$/.test(trimmedName);
};

export const validateEmail = (email: string | undefined | null): boolean => {
  if (!email) {
    return false;
  }
  const trimmedEmail = email.trim();
  if (trimmedEmail.length === 0) {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmedEmail);
};

export const validatePhone = (phone: string | undefined | null): boolean => {
  if (!phone) {
    return false;
  }
  const trimmedPhone = phone.trim();
  if (trimmedPhone.length === 0) {
    return false;
  }
  const phoneRegex = /^\+91-\d{10}$/;
  return phoneRegex.test(trimmedPhone);
};

export const validateLocation = (
  location: string | undefined | null,
): boolean => {
  if (!location) {
    return false;
  }
  return location.trim().length > 0;
};
