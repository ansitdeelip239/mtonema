/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useCallback, useMemo} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Text, Card} from 'react-native-paper';
import {TeamStackParamList} from '../../../navigator/components/TeamStack';
import {MaterialTextInput} from '../../../components/MaterialTextInput';
import Header from '../../../components/Header';
import useForm from '../../../hooks/useForm';
import PartnerService from '../../../services/PartnerService';
import {
  TeamMemberFormData,
  validateTeamMemberForm,
  teamMemberSchema,
} from '../../../schema/TeamMemberSchema';
import Toast from 'react-native-toast-message';
import {useTheme} from '../../../context/ThemeProvider';
import {usePartner} from '../../../context/PartnerProvider';
import {useRazorpayPayment} from '../../../hooks/useRazorpayPayment';
import { PaymentLoadingOverlay } from '../../../components/PaymentLoading';
import Roles from '../../../constants/Roles';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthProvider';

type Props = NativeStackScreenProps<TeamStackParamList, 'Add Teams Screen'>;

const AddTeamScreen: React.FC<Props> = ({navigation, route}) => {
  const {user} = useAuth();
  const {theme} = useTheme();
  const {setTeamUpdated} = usePartner();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { t } = useTranslation();

  // If editMode, prefill with teamData
  const editMode = route?.params?.editMode === true;
  const initialFormState: TeamMemberFormData =
    editMode && route?.params?.teamData
      ? {
          name: route.params.teamData.name || '',
          email: route.params.teamData.email || '',
          phone: route.params.teamData.phone || '',
          location: route.params.teamData.location || '',
        }
      : {
          name: '',
          email: '',
          phone: '',
          location: '',
        };

  const onPaymentSuccess = useCallback(() => {
    Toast.show({
      type: 'success',
      text1: t('common.success.title', 'Success'),
      text2: t('teams.messages.memberAdded', 'Team member added successfully!'),
    });

    setTeamUpdated(true);
    resetForm();
    navigation.goBack();
  }, [t, setTeamUpdated, navigation]);

  const {isPaying, isVerifying, processPayment} = useRazorpayPayment({
    onPaymentSuccess,
    successMessage: {
      title: 'Payment Success',
      subtitle: 'Your subscription has been activated successfully!',
    },
  });

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
            text1: t('common.errors.error', 'Error'),
            text2: t('teams.errors.userIdRequired', 'User ID is not available. Please log in again.'),
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

        if (editMode) {
          // Update team member logic (replace with your update API call)
          await PartnerService.updateTeamMember({
            ...payload,
            teamId: parseInt(route.params.teamData?.teamMemberId as string, 10),
            isActive: true,
          });

          Toast.show({
            type: 'success',
            text1: t('common.success.title', 'Success'),
            text2: t('teams.messages.memberUpdated', 'Team member updated successfully!'),
          });
        } else {
          // If user is ADMIN, skip payment gateway
          if (user?.role === Roles.ADMIN) {
            await PartnerService.addTeamMember(payload);
            Toast.show({
              type: 'success',
              text1: t('common.success.title', 'Success'),
              text2: t('teams.messages.memberAdded', 'Team member added successfully!'),
            });
            setTeamUpdated(true);
            resetForm();
            navigation.goBack();
            return;
          }
          // Otherwise, show payment gateway
          const response = await PartnerService.addTeamMember(payload);
          const {amount, orderId, keyId} = response.data.paymentDetails;
          await processPayment({
            key: keyId,
            amount,
            currency: 'INR',
            description: 'Team Member Subscription',
            order_id: orderId,
            prefill: {
              email: payload.email,
              contact: payload.phone,
              name: payload.name,
            },
            theme: {color: theme.primaryColor},
          });
        }
      } catch (error: any) {
        console.error('Error creating/updating team member:', error);
        if (error.response?.data?.message) {
          Toast.show({
            type: 'error',
            text1: t('common.errors.error', 'Error'),
            text2: error.response.data.message,
          });
        } else if (error.message) {
          Toast.show({
            type: 'error',
            text1: t('common.errors.error', 'Error'),
            text2: error.message,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: t('common.errors.error', 'Error'),
            text2: editMode
              ? t('teams.errors.updateFailed', 'Failed to update team member. Please try again.')
              : t('teams.errors.addFailed', 'Failed to add team member. Please try again.'),
          });
        }
      }
    },
    [user?.id, navigation, editMode, route?.params?.teamData],
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

  const isProcessing = loading || isPaying || isVerifying;

  return (
    <View style={styles.container}>
      {Platform.OS === 'android' && (
        <Header
          title={editMode ? t('teams.headers.editMember', 'Edit Team Member') : t('teams.headers.addMember', 'Add Team Member')}
          backButton
          onBackPress={() => navigation.goBack()}
        />
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
              <Text style={styles.title}>
                {editMode ? t('teams.headers.editMember', 'Edit Team Member') : t('teams.headers.addNewMember', 'Add New Team Member')}
              </Text>
              <Text style={styles.subtitle}>
                {editMode
                  ? t('teams.messages.editDescription', 'Update the details of your team member')
                  : t('teams.messages.addDescription', 'Fill in the details to add a new member to your team')}
              </Text>

              <View style={styles.formContainer}>
                <MaterialTextInput
                  field="name"
                  formInput={formInput}
                  setFormInput={handleInputChangeWithValidation}
                  label={editMode ? t('teams.labels.fullNameEdit', 'Full Name * (Edit)') : t('teams.labels.fullName', 'Full Name *')}
                  placeholder={
                    editMode
                      ? t('teams.placeholders.editFullName', "Edit team member's full name")
                      : t('teams.placeholders.fullName', "Enter team member's full name")
                  }
                  mode="outlined"
                  errorMessage={fieldErrors.name}
                  autoCapitalize="words"
                  maxLength={50}
                />

                <MaterialTextInput
                  field="email"
                  formInput={formInput}
                  setFormInput={handleInputChangeWithValidation}
                  label={
                    editMode ? t('teams.labels.emailEdit', 'Email Address * (Edit)') : t('teams.labels.email', 'Email Address *')
                  }
                  placeholder={
                    editMode ? t('teams.placeholders.editEmail', 'Edit email address') : t('teams.placeholders.email', 'Enter email address')
                  }
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
                  label={editMode ? t('teams.labels.phoneEdit', 'Phone Number * (Edit)') : t('teams.labels.phone', 'Phone Number *')}
                  placeholder={
                    editMode
                      ? t('teams.placeholders.editPhone', 'Edit 10-digit phone number')
                      : t('teams.placeholders.phone', 'Enter 10-digit phone number')
                  }
                  mode="outlined"
                  errorMessage={fieldErrors.phone}
                  keyboardType="phone-pad"
                  maxLength={10}
                />

                <MaterialTextInput
                  field="location"
                  formInput={formInput}
                  setFormInput={handleInputChangeWithValidation}
                  label={editMode ? t('teams.labels.locationEdit', 'Location * (Edit)') : t('teams.labels.location', 'Location *')}
                  placeholder={
                    editMode
                      ? t('teams.placeholders.editLocation', 'Edit location (City, State, Country)')
                      : t('teams.placeholders.location', 'Enter location (City, State, Country)')
                  }
                  mode="outlined"
                  errorMessage={fieldErrors.location}
                  autoCapitalize="words"
                  maxLength={100}
                />
              </View>
            </Card.Content>
          </Card>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.cancelButton, loading && styles.disabledButton]}
              onPress={() => navigation.goBack()}
              disabled={loading}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.cancelButtonText,
                  loading && styles.disabledButtonText,
                ]}>
                {t('common.actions.cancel', 'Cancel')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitButton,
                {backgroundColor: theme.primaryColor},
                (!isFormValid() || loading) && styles.disabledSubmitButton,
              ]}
              onPress={onSubmit}
              disabled={!isFormValid() || loading}
              activeOpacity={0.7}>
              <View style={styles.submitButtonContent}>
                {loading && (
                  <ActivityIndicator
                    size="small"
                    color="#fff"
                    style={styles.loadingIndicator}
                  />
                )}
                <Text
                  style={[
                    styles.submitButtonText,
                    (!isFormValid() || loading) &&
                      styles.disabledSubmitButtonText,
                  ]}>
                  {loading
                    ? editMode
                      ? t('teams.states.updating', 'Updating...')
                      : t('teams.states.adding', 'Adding...')
                    : editMode
                    ? t('teams.actions.updateMember', 'Update Member')
                    : t('teams.actions.addMember', 'Add Member')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* Unified payment loading overlay */}
      {isProcessing && (
        <PaymentLoadingOverlay
          isCreatingOrder={loading}
          isPaying={isPaying}
          isVerifying={isVerifying}
        />
      )}
    </View>
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#64748b',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  loadingIndicator: {
    marginRight: 8,
  },
  disabledButton: {
    opacity: 0.6,
    borderColor: '#cbd5e1',
  },
  disabledButtonText: {
    color: '#cbd5e1',
  },
  disabledSubmitButton: {
    opacity: 0.6,
    backgroundColor: '#cbd5e1',
  },
  disabledSubmitButtonText: {
    color: '#94a3b8',
  },
});

export default AddTeamScreen;
