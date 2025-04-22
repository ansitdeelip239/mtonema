import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  useWindowDimensions,
} from 'react-native';
import Colors from '../../../../../constants/Colors';

interface FormStepperProps {
  steps: string[];
  currentStep: number;
  animatedValue: Animated.Value;
}

const FormStepper: React.FC<FormStepperProps> = ({
  steps,
  currentStep,
  animatedValue,
}) => {
  const {width} = useWindowDimensions();

  const circleWidth = 34; // Width of the circle
  const circleRadius = circleWidth / 2;
  const containerPadding = 20; // From container style paddingHorizontal
  const lineAdjustment = 6; // Small adjustment to shorten line slightly

  const lineWidth = width - 2 * containerPadding - 2 * circleRadius - lineAdjustment;

  const progressWidth = animatedValue.interpolate({
    inputRange: [0, steps.length - 1],
    outputRange: [circleRadius, lineWidth - circleRadius],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Progress line that goes behind circles */}
      <View
        style={[
          styles.lineContainer,
          {
            width: lineWidth,
            left: containerPadding + circleRadius + (lineAdjustment / 2), // Center the adjusted line
          },
        ]}>
        <View style={styles.backgroundLine} />
        <Animated.View style={[styles.progressLine, {width: progressWidth}]} />
      </View>

      <View style={styles.stepsContainer}>
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <View key={index} style={styles.stepContainer}>
              <View
                style={[
                  styles.circle,
                  isActive && styles.activeCircle,
                  isCompleted && styles.completedCircle,
                ]}>
                <Text
                  style={[
                    styles.stepNumber,
                    isActive && styles.activeStepNumber,
                    isCompleted && styles.completedStepNumber,
                  ]}>
                  {index + 1}
                </Text>
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  isActive && styles.activeStepLabel,
                  isCompleted && styles.completedStepLabel,
                ]}>
                {step}
              </Text>
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
    backgroundColor: Colors.main,
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
    borderColor: Colors.main,
  },
  completedCircle: {
    backgroundColor: Colors.main,
    borderColor: Colors.main,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#888',
  },
  activeStepNumber: {
    color: Colors.main,
  },
  completedStepNumber: {
    color: 'white',
  },
  stepLabel: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 4,
  },
  activeStepLabel: {
    color: Colors.main,
    fontWeight: 'bold',
  },
  completedStepLabel: {
    color: Colors.main,
  },
});

export default FormStepper;
