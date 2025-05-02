import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '../../../../../context/ThemeProvider';

interface FormNavigationButtonsProps {
  onNext?: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  isNextEnabled?: boolean;
  isSubmitting?: boolean;
  nextButtonText?: string;
}

const FormNavigationButtons: React.FC<FormNavigationButtonsProps> = ({
  onNext,
  onBack,
  showBackButton = false,
  isNextEnabled = true,
  isSubmitting = false,
  nextButtonText = 'Next',
}) => {
  const {theme} = useTheme();

  return (
    <View style={styles.buttonsContainer}>
      {showBackButton && (
        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={onBack}
          disabled={isSubmitting}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[
          styles.button,
          // eslint-disable-next-line react-native/no-inline-styles
          isNextEnabled ? {backgroundColor: theme.primaryColor, marginLeft: 'auto'} : styles.disabledButton,
          showBackButton ? {} : styles.fullWidthButton,
        ]}
        onPress={isNextEnabled ? onNext : undefined}
        disabled={!isNextEnabled || isSubmitting}>
        {isSubmitting ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text
            style={
              isNextEnabled ? styles.nextButtonText : styles.disabledButtonText
            }>
            {nextButtonText}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  backButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  fullWidthButton: {
    flex: 1,
  },
  backButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  nextButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    marginLeft: 'auto',
  },
  disabledButtonText: {
    color: '#888888',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default FormNavigationButtons;
