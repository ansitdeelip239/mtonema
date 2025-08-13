/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useCallback, useMemo} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Button } from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Text, Card} from 'react-native-paper';
import {TeamStackParamList} from '../../../navigator/components/TeamStack';
import {MaterialTextInput} from '../../../components/MaterialTextInput';
import Header from '../../../components/Header';
import useForm from '../../../hooks/useForm';
import {useAuth} from '../../../hooks/useAuth';
import PartnerService from '../../../services/PartnerService';
import {
  TeamMemberFormData,
  validateTeamMemberForm,
  teamMemberSchema,
} from '../../../schema/TeamMemberSchema';
import Toast from 'react-native-toast-message';
import {useTheme} from '../../../context/ThemeProvider';
import { usePartner } from '../../../context/PartnerProvider';

type Props = NativeStackScreenProps<TeamStackParamList, 'Add Teams Screen'>;

const AddTeamScreen: React.FC<Props> = ({navigation}) => {
  const {user} = useAuth();
  const {theme} = useTheme();
  const {setTeamUpdated} = usePartner();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const initialFormState: TeamMemberFormData = {
    name: '',
    email: '',
    phone: '',
    location: '',
  };

  const handleSubmit = useCallback(
    async (formData: TeamMemberFormData) => {
      // Validate form data
      const validation = validateTeamMemberForm(formData);
      if (!validation.success) {
        setErrors(validation.errors);
        return;
      }

      // Clear previous errors
      setErrors({});

      try {
        if (!user?.id) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'User ID is not available. Please log in again.',
          });
          return;
        }

        const payload = {
          partnerId: parseInt(user.id.toString(), 10),
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          location: formData.location.trim(),
        };

        await PartnerService.addTeamMember(payload);

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Team member added successfully!',
        });

        setTeamUpdated(true);

        resetForm();
        navigation.goBack();
      } catch (error: any) {
        console.error('Error creating team member:', error);

        if (error.response?.data?.message) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: error.response.data.message,
          });
        } else if (error.message) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: error.message,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to add team member. Please try again.',
          });
        }
      }
    },
    [user?.id, navigation],
  );

  const {formInput, handleInputChange, loading, onSubmit, resetForm} = useForm({
    initialState: initialFormState,
    onSubmit: handleSubmit,
  });

  // Live validation for individual fields
  const validateField = useCallback(
    (field: keyof TeamMemberFormData, value: string) => {
      try {
        // Validate individual field using Zod schema
        const fieldSchema = teamMemberSchema.pick({[field]: true} as Record<
          typeof field,
          true
        >);
        fieldSchema.parse({[field]: value});
        return null; // No error
      } catch (error: any) {
        if (error.errors && error.errors[0]) {
          return error.errors[0].message;
        }
        return 'Invalid input';
      }
    },
    [],
  );

  const isFormValid = useCallback(() => {
    const validation = validateTeamMemberForm(formInput);
    return (
      validation.success &&
      formInput.name.trim() &&
      formInput.email.trim() &&
      formInput.phone.trim() &&
      formInput.location.trim()
    );
  }, [formInput]);

  const handleInputChangeWithValidation = useCallback(
    (field: keyof TeamMemberFormData, value: string | boolean) => {
      const stringValue = typeof value === 'boolean' ? value.toString() : value;

      // Update form input
      handleInputChange(field, stringValue);

      // Perform live validation only if field has content or user has previously interacted
      if (stringValue.trim() || errors[field]) {
        const fieldError = validateField(field, stringValue);

        setErrors(prev => ({
          ...prev,
          [field]: fieldError || '',
        }));
      }
    },
    [handleInputChange, errors, validateField],
  );

  // Memoize error messages to avoid unnecessary re-renders
  const fieldErrors = useMemo(
    () => ({
      name: errors.name,
      email: errors.email,
      phone: errors.phone,
      location: errors.location,
    }),
    [errors],
  );

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === 'android' && (
        <Header title="Add Team Member" backButton />
      )}

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Card style={styles.formCard}>
            <Card.Content style={styles.cardContent}>
              <Text style={styles.title}>Add New Team Member</Text>
              <Text style={styles.subtitle}>
                Fill in the details to add a new member to your team
              </Text>

              <View style={styles.formContainer}>
                <MaterialTextInput
                  field="name"
                  formInput={formInput}
                  setFormInput={handleInputChangeWithValidation}
                  label="Full Name *"
                  placeholder="Enter team member's full name"
                  mode="outlined"
                  errorMessage={fieldErrors.name}
                  autoCapitalize="words"
                  maxLength={50}
                />

                <MaterialTextInput
                  field="email"
                  formInput={formInput}
                  setFormInput={handleInputChangeWithValidation}
                  label="Email Address *"
                  placeholder="Enter email address"
                  mode="outlined"
                  errorMessage={fieldErrors.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  maxLength={100}
                />

                <MaterialTextInput
                  field="phone"
                  formInput={formInput}
                  setFormInput={handleInputChangeWithValidation}
                  label="Phone Number *"
                  placeholder="Enter 10-digit phone number"
                  mode="outlined"
                  errorMessage={fieldErrors.phone}
                  keyboardType="phone-pad"
                  maxLength={10}
                />

                <MaterialTextInput
                  field="location"
                  formInput={formInput}
                  setFormInput={handleInputChangeWithValidation}
                  label="Location *"
                  placeholder="Enter location (City, State, Country)"
                  mode="outlined"
                  errorMessage={fieldErrors.location}
                  autoCapitalize="words"
                  maxLength={100}
                />
              </View>
            </Card.Content>
          </Card>

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
              disabled={loading}>
              Cancel
            </Button>

            <Button
              mode="contained"
              onPress={onSubmit}
              style={[
                styles.submitButton,
                {backgroundColor: theme.primaryColor},
              ]}
              disabled={!isFormValid() || loading}
              loading={loading}>
              {loading ? 'Adding...' : 'Add Member'}
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    padding: 16,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
    lineHeight: 20,
  },
  formContainer: {
    gap: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    paddingHorizontal: 4,
  },
  cancelButton: {
    flex: 1,
    borderColor: '#64748b',
  },
  submitButton: {
    flex: 1,
  },
});

export default AddTeamScreen;
