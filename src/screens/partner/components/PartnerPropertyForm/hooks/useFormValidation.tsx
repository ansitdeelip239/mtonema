import {useCallback} from 'react';
import {PartnerPropertyFormType} from '../../../../../schema/PartnerPropertyFormSchema';

export const useFormValidation = (formInput: PartnerPropertyFormType) => {
  const validateStep = useCallback(
    (stepIndex: number): boolean => {
      switch (stepIndex) {
        case 0:
          // Basic info validation - all fields are required
          return !!(
            formInput.propertyName &&
            formInput.propertyName.trim() !== '' &&
            formInput.sellerType &&
            formInput.city &&
            formInput.propertyFor &&
            formInput.propertyType &&
            formInput.location &&
            formInput.location.trim() !== '' &&
            formInput.price &&
            Number(formInput.price) > 0
          );
        case 1:
          // Property details - optional fields
          return true;
        case 2:
          // Media & Submit - optional fields
          return true;
        default:
          return false;
      }
    },
    [formInput],
  );

  return {validateStep};
};
