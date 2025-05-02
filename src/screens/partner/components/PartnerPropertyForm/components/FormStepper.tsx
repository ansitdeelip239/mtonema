import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '../../../../../context/ThemeProvider';

interface FormStepperProps {
  steps: string[];
  currentStep: number;
  animatedValue: Animated.Value;
  onStepPress?: (stepIndex: number) => void;
  canMoveToNextStep?: boolean; // New prop to indicate if next step is available
}

const FormStepper: React.FC<FormStepperProps> = ({
  steps,
  currentStep,
  animatedValue,
  onStepPress,
  canMoveToNextStep = false, // Default to false
}) => {
  const {width} = useWindowDimensions();
  const {theme} = useTheme();

  const circleWidth = 34; // Width of the circle
  const circleRadius = circleWidth / 2;
  const containerPadding = 20; // From container style paddingHorizontal
  const lineAdjustment = 6; // Small adjustment to shorten line slightly

  const lineWidth =
    width - 2 * containerPadding - 2 * circleRadius - lineAdjustment;

  const progressWidth = animatedValue.interpolate({
    inputRange: [0, steps.length - 1],
    outputRange: [circleRadius, lineWidth - circleRadius],
    extrapolate: 'clamp',
  });

  const handleStepPress = (index: number) => {
    if (onStepPress) {
      onStepPress(index);
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress line that goes behind circles */}
      <View
        style={[
          styles.lineContainer,
          {
            width: lineWidth,
            left: containerPadding + circleRadius + lineAdjustment / 2,
          },
        ]}>
        <View style={styles.backgroundLine} />
        <Animated.View style={[styles.progressLine, {backgroundColor: theme.primaryColor}, {width: progressWidth}]} />
      </View>

      <View style={styles.stepsContainer}>
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          // Allow navigation to completed steps, current step, and next step if validation passes
          const canNavigate =
            index <= currentStep ||
            (index === currentStep + 1 && canMoveToNextStep);

          return (
            <View key={index} style={styles.stepContainer}>
              <TouchableOpacity
                activeOpacity={canNavigate ? 0.7 : 1}
                disabled={!onStepPress || !canNavigate}
                onPress={() => handleStepPress(index)}
                style={[
                  styles.stepTouchable,
                  canNavigate && styles.clickableStep,
                ]}>
                <View
                  style={[
                    styles.circle,
                    isActive && styles.activeCircle,
                    isActive && {borderColor: theme.primaryColor},
                    isCompleted && {backgroundColor: theme.primaryColor, borderColor: theme.primaryColor},
                    !canNavigate && styles.disabledCircle,
                  ]}>
                  <Text
                    style={[
                      styles.stepNumber,
                      isActive && {color: theme.primaryColor},
                      isCompleted && styles.completedStepNumber,
                      !canNavigate && styles.disabledStepNumber,
                    ]}>
                    {index + 1}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    isActive && styles.activeStepLabel,
                    isActive && {color: theme.primaryColor},
                    isCompleted && {color: theme.primaryColor},
                    !canNavigate && styles.disabledStepLabel,
                    // Add a visual cue for the next available step
                    index === currentStep + 1 &&
                      canMoveToNextStep &&
                      styles.nextAvailableStep,
                    index === currentStep + 1 &&
                      canMoveToNextStep &&
                      {color: theme.primaryColor},
                  ]}>
                  {step}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 20,
    position: 'relative',
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 2, // Ensure circles appear above the line
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
  },
  stepTouchable: {
    alignItems: 'center',
  },
  lineContainer: {
    position: 'absolute',
    top: 15, // Position the line to go through the middle of circles
    height: 4,
    zIndex: 1, // Place line behind circles
  },
  backgroundLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
  },
  progressLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 4,
    borderRadius: 2,
  },
  circle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#f0f0f0',
    marginBottom: 8,
    zIndex: 2,
  },
  activeCircle: {
    backgroundColor: 'white',
  },
  disabledCircle: {
    opacity: 0.5,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#888',
  },
  completedStepNumber: {
    color: 'white',
  },
  disabledStepNumber: {
    color: '#aaa',
  },
  stepLabel: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 4,
  },
  activeStepLabel: {
    fontWeight: 'bold',
  },
  disabledStepLabel: {
    color: '#aaa',
  },
  clickableStep: {
    opacity: 1,
  },
  nextAvailableStep: {
    opacity: 0.8,
  },
});

export default FormStepper;
