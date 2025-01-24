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
    return false; // Return false if phone is undefined or null
  }

  const trimmedPhone = phone.trim(); // Remove leading/trailing spaces
  if (trimmedPhone.length === 0) {
    return false; // Return false if phone is empty
  }

  const phoneRegex = /^\d{10}$/; // Regex to match exactly 10 digits
  return phoneRegex.test(trimmedPhone); // Test the phone number against the regex
};




export const validateLocation = (
  location: string | undefined | null,
): boolean => {
  if (!location) {
    return false;
  }
  return location.trim().length > 0;
};
