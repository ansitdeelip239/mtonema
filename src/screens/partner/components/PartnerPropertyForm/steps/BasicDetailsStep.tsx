import React, {useCallback, useState, useEffect, useRef} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import FormNavigationButtons from '../components/FormNavigationButtons';
import partnerPropertyFormSchema, {
  PartnerPropertyFormType,
} from '../../../../../schema/PartnerPropertyFormSchema';
import {useMaster} from '../../../../../context/MasterProvider';
import {usePartner} from '../../../../../context/PartnerProvider'; // Added
import {MaterialTextInput} from '../../../../../components/MaterialTextInput';
import FilterOption from '../../../../../components/FilterOption';
import {formatCurrency} from '../../../../../utils/currency';
import {z} from 'zod';
import MasterService from '../../../../../services/MasterService';
import {PlacePrediction} from '../../../../../types/googlePlaces';


interface BasicDetailsStepProps {
  formInput: PartnerPropertyFormType;
  handleInputChange: (field: keyof PartnerPropertyFormType, value: any) => void;
  handleSelect: <K extends keyof PartnerPropertyFormType>(
    field: K,
    value: string,
  ) => void;
  onNext: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

const BasicDetailsStep: React.FC<BasicDetailsStepProps> = ({
  formInput,
  handleInputChange,
  handleSelect,
  onNext,
  onBack,
  showBackButton = false,
}) => {
  const {masterData} = useMaster();
  const {cities} = usePartner();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [shouldShowErrors, setShouldShowErrors] = useState(false);

  // Add state for location suggestions
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const locationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [placePredictions, setPlacePredictions] = useState<PlacePrediction[]>(
    [],
  );

  // Add a ref to track if location was just selected
  const justSelectedRef = useRef(false);

  // Validate and show errors while typing
  const validateField = useCallback(
    (field: keyof PartnerPropertyFormType, value: any) => {
      try {
        // Create a partial schema with just the field being validated
        const fieldSchema = z.object({
          [field]: partnerPropertyFormSchema.shape[field],
        });

        fieldSchema.parse({[field]: value});
        setErrors(prev => ({...prev, [field]: ''}));
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldError = error.errors.find(err => err.path[0] === field);
          if (fieldError && shouldShowErrors) {
            setErrors(prev => ({...prev, [field]: fieldError.message}));
          }
        }
      }
    },
    [shouldShowErrors],
  );

  // Perform silent validation for next button
  const validateFormSilently = useCallback(() => {
    try {
      const step1Fields = [
        'propertyName',
        'sellerType',
        'city',
        'propertyFor',
        'propertyType',
        'location',
        'price',
      ];

      const step1Data = Object.fromEntries(
        step1Fields.map(field => [
          field,
          formInput[field as keyof PartnerPropertyFormType],
        ]),
      );

      partnerPropertyFormSchema.parse(step1Data);
      return true;
    } catch (error) {
      return false;
    }
  }, [formInput]);

  useEffect(() => {
    const isValid = validateFormSilently();
    setIsFormValid(isValid);

    // If all fields are empty, reset all states
    const allEmpty = Object.values(formInput).every(
      value => value === '' || value === null || value === undefined,
    );

    if (allEmpty) {
      setErrors({});
      setAttemptedSubmit(false);
      setShouldShowErrors(false);
    }
  }, [formInput, validateFormSilently]);

  const handleFieldSelect = useCallback(
    (field: keyof PartnerPropertyFormType, value: string) => {
      handleSelect(field, value);
      validateField(field, value);
    },
    [handleSelect, validateField],
  );

  // Debounced function to fetch location suggestions using Google Places API
  const fetchLocationSuggestions = useCallback(async (searchText: string) => {
    console.log('fetchLocationSuggestions called with:', searchText);

    if (searchText.length < 3) {
      console.log('Search text too short, clearing suggestions');
      setLocationSuggestions([]);
      setPlacePredictions([]);
      return;
    }

    // Clear previous timeout if exists
    if (locationTimeoutRef.current) {
      clearTimeout(locationTimeoutRef.current);
    }

    // Set a new timeout for debouncing
    locationTimeoutRef.current = setTimeout(async () => {
      try {
        setIsLoadingSuggestions(true);

        // Call Google Places API
        const response = await MasterService.getGooglePlaces(searchText);

        if (response && response.predictions) {
          console.log(`Got ${response.predictions.length} predictions`);

          // Store full prediction objects for later use
          setPlacePredictions(
            response.predictions as unknown as PlacePrediction[],
          );

          // Extract just the descriptions for display
          const descriptions = response.predictions.map(
            prediction => prediction.description,
          );

          setLocationSuggestions(descriptions);
        } else {
          console.log('No predictions found in response');
          setLocationSuggestions([]);
          setPlacePredictions([]);
        }
      } catch (error) {
        console.error('Error fetching Google Places suggestions:', error);
        setLocationSuggestions([]);
        setPlacePredictions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 500); // 500ms debounce delay
  }, []);

  // Handle suggestion selection
  const handleLocationSuggestionSelect = useCallback(
    (suggestion: string) => {
      // Set the ref to true - we just selected from suggestions
      justSelectedRef.current = true;

      handleInputChange('location', suggestion);

      // Find the selected prediction to get additional data if needed
      const selectedPrediction = placePredictions.find(
        prediction => prediction.description === suggestion,
      );

      // You can use additional data from the prediction if needed
      if (selectedPrediction) {
        // Example: store place_id in another field if needed
        // handleInputChange('locationPlaceId', selectedPrediction.place_id);

        // For now, we'll just use the description
        console.log('Selected place_id:', selectedPrediction.place_id);
      }

      // Clear suggestions after selection
      setLocationSuggestions([]);
      setPlacePredictions([]);

      // Reset the flag after a short delay
      setTimeout(() => {
        justSelectedRef.current = false;
      }, 100);
    },
    [handleInputChange, placePredictions],
  );

  const handleTextInputChange = (
    field: keyof PartnerPropertyFormType,
    value: any,
  ) => {
    handleInputChange(field, value);
    setShouldShowErrors(true);
    validateField(field, value);

    // Fetch suggestions if this is a location field input
    if (field === 'location') {
      fetchLocationSuggestions(value);
    }
  };

  const handleNext = () => {
    setAttemptedSubmit(true);
    setShouldShowErrors(true);

    try {
      const step1Fields = [
        'propertyName',
        'sellerType',
        'city',
        'propertyFor',
        'propertyType',
        'location',
        'price',
      ];

      const step1Data = Object.fromEntries(
        step1Fields.map(field => [
          field,
          formInput[field as keyof PartnerPropertyFormType],
        ]),
      );

      partnerPropertyFormSchema.parse(step1Data);
      onNext();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          const field = err.path[0] as string;
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
      }
    }
  };

  useEffect(() => {
    console.log(locationSuggestions);
  }, [locationSuggestions]);

  // Get error message based on validation state
  const getErrorMessage = (field: keyof PartnerPropertyFormType) => {
    if (shouldShowErrors || attemptedSubmit) {
      return errors[field];
    }
    return undefined;
  };

  // Update useEffect to watch for city changes to refresh location suggestions
  useEffect(() => {
    // Skip API call if we just selected from suggestions
    if (justSelectedRef.current) {
      return;
    }

    if (formInput.location && formInput.location.length >= 3) {
      fetchLocationSuggestions(formInput.location);
    }
  }, [formInput.city, fetchLocationSuggestions, formInput.location]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (locationTimeoutRef.current) {
        clearTimeout(locationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <MaterialTextInput
        field="propertyName"
        formInput={formInput}
        setFormInput={handleTextInputChange}
        label="Property Name*"
        mode="outlined"
        placeholder="Enter a property name"
        errorMessage={getErrorMessage('propertyName')}
      />

      <FilterOption
        label="Seller Type*"
        options={masterData?.SellerType || []}
        selectedValue={formInput.sellerType}
        onSelect={value => handleFieldSelect('sellerType', value)}
        error={getErrorMessage('sellerType')}
      />

      <FilterOption
        label="City*"
        options={cities || []}
        selectedValue={formInput.city}
        onSelect={value => handleFieldSelect('city', value)}
        error={getErrorMessage('city')}
      />

      <FilterOption
        label="Property For*"
        options={masterData?.PropertyFor || []}
        selectedValue={formInput.propertyFor}
        onSelect={value => handleFieldSelect('propertyFor', value)}
        error={getErrorMessage('propertyFor')}
      />

      <FilterOption
        label="Property Type*"
        options={masterData?.PropertyType || []}
        selectedValue={formInput.propertyType}
        onSelect={value => handleFieldSelect('propertyType', value)}
        error={getErrorMessage('propertyType')}
      />

      <MaterialTextInput
        field="location"
        formInput={formInput}
        setFormInput={handleTextInputChange}
        label="Location*"
        mode="outlined"
        placeholder="Enter location details"
        errorMessage={getErrorMessage('location')}
        suggestions={locationSuggestions}
        onSuggestionSelect={handleLocationSuggestionSelect}
        loading={isLoadingSuggestions}
      />

      <MaterialTextInput
        field="price"
        formInput={formInput}
        setFormInput={handleTextInputChange}
        label="Price*"
        mode="outlined"
        placeholder="Enter property price"
        keyboardType="number-pad"
        maxLength={10}
        errorMessage={getErrorMessage('price')}
        rightComponent={<Text>{formatCurrency(formInput.price)}</Text>}
      />

      {/* Navigation buttons */}
      <FormNavigationButtons
        onNext={handleNext}
        onBack={onBack}
        showBackButton={showBackButton}
        isNextEnabled={isFormValid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
});

export default BasicDetailsStep;
