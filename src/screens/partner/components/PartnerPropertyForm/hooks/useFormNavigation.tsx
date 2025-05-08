import {useRef, useState, useCallback} from 'react';
import {Animated, Dimensions, ScrollView} from 'react-native';
import Toast from 'react-native-toast-message';

const {width} = Dimensions.get('window');

interface UseFormNavigationParams {
  steps: string[];
  validateStep: (stepIndex: number) => boolean;
}

export const useFormNavigation = ({
  steps,
  validateStep,
}: UseFormNavigationParams) => {
  const [currentStep, setCurrentStep] = useState(0);

  // Animation values
  const animatedValue = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(0)).current;

  // ScrollView references
  const scrollViewRefs = useRef<(ScrollView | null)[]>(
    Array(steps.length).fill(null),
  );

  // Animate to specific step
  const animateToStep = useCallback(
    (stepIndex: number) => {
      Animated.timing(animatedValue, {
        toValue: stepIndex,
        duration: 300,
        useNativeDriver: false,
      }).start();

      Animated.timing(slideAnimation, {
        toValue: stepIndex * -width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep(stepIndex);

        // Scroll to top of the selected step
        const selectedScrollView = scrollViewRefs.current[stepIndex];
        if (selectedScrollView) {
          selectedScrollView.scrollTo({x: 0, y: 0, animated: false});
        }
      });
    },
    [animatedValue, slideAnimation],
  );

  // Step navigation handler
  const handleStepPress = useCallback(
    (stepIndex: number) => {
      // Can always go back
      if (stepIndex < currentStep) {
        animateToStep(stepIndex);
        return;
      }

      // Going to next step requires validation
      if (stepIndex === currentStep + 1) {
        if (validateStep(currentStep)) {
          animateToStep(stepIndex);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Validation Error',
            text2: 'Please complete the current step before moving forward.',
          });
        }
        return;
      }

      // Prevent skipping steps
      if (stepIndex > currentStep + 1) {
        Toast.show({
          type: 'error',
          text1: 'Cannot skip steps',
          text2: 'Please complete steps in order.',
        });
      }
    },
    [currentStep, validateStep, animateToStep],
  );

  const goToNextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      if (validateStep(currentStep)) {
        handleStepPress(currentStep + 1);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Validation Error',
          text2: 'Please fill in all required fields before proceeding.',
        });
      }
    }
  }, [currentStep, steps.length, validateStep, handleStepPress]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 0) {
      handleStepPress(currentStep - 1);
    }
  }, [currentStep, handleStepPress]);

  const resetNavigation = useCallback(() => {
    setCurrentStep(0);
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 0,
      useNativeDriver: false,
    }).start();
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 0,
      useNativeDriver: true,
    }).start();
  }, [animatedValue, slideAnimation]);

  return {
    currentStep,
    animatedValue,
    slideAnimation,
    scrollViewRefs,
    handleStepPress,
    goToNextStep,
    goToPreviousStep,
    resetNavigation,
  };
};
