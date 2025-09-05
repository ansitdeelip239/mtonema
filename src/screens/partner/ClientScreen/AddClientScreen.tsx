import React, { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { ClientForm } from '../../../types';
import { MaterialTextInput } from '../../../components/MaterialTextInput';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ClientStackParamList } from '../../../navigator/components/ClientScreenStack';
import Header from '../../../components/Header';
import { PartnerDrawerParamList } from '../../../types/navigation';
import useForm from '../../../hooks/useForm';
import PartnerService from '../../../services/PartnerService';
import { usePartner } from '../../../context/PartnerProvider';
import Toast from 'react-native-toast-message';
import { z } from 'zod';
import clientFormSchema from '../../../schema/ClientFormSchema';
import GroupsToggleComponent from './components/GroupsToggle';
import { useTheme } from '../../../context/ThemeProvider';
import { addCountryCode } from '../../../utils/phoneUtils';
import { stripHtmlTags } from '../../../utils/formUtils';
import { useAuth } from '../../../context/AuthProvider';
import { useDialog } from '../../../context/DialogProvider';

type Props = NativeStackScreenProps<ClientStackParamList, 'AddClientScreen'>;

const AddClientScreen: React.FC<Props> = ({ navigation, route }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const { setClientsUpdated } = usePartner();
  const { user } = useAuth();
  const { theme } = useTheme();
  const { showError } = useDialog();
  const { t } = useTranslation();

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const editMode = route.params?.editMode;
  const clientData = route.params?.clientData;

  const initialState = useMemo(() => {
    if (editMode && clientData) {
      return {
        clientName: clientData.clientName || '',
        displayName: clientData.displayName || '',
        mobileNumber: clientData.mobileNumber || '',
        whatsappNumber: clientData.whatsappNumber || '',
        emailId: clientData.emailId || '',
        notes: stripHtmlTags(clientData.notes || ''), // Clean notes here
        groups: clientData.groups?.map(group => group.id) || [],
        partnerId: user?.email ?? '',
      };
    }

    return {
      clientName: '',
      displayName: '',
      mobileNumber: '',
      whatsappNumber: '',
      emailId: '',
      notes: '',
      groups: [],
      partnerId: user?.email ?? '',
    };
  }, [editMode, clientData, user]);

  const validateField = useCallback((field: keyof ClientForm, value: any) => {
    if (field !== 'clientName' && (!value || value === '')) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
      return;
    }

    try {
      const schema = clientFormSchema.shape[field];
      schema.parse(value);
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    } catch (err) {
      if (err instanceof z.ZodError) {
        setFieldErrors(prev => ({
          ...prev,
          [field]: err.errors[0].message,
        }));
      }
    }
  }, []);

  const {
    formInput,
    handleInputChange,
    loading: formLoading,
    onSubmit: handleSubmit,
    setFormInput,
  } = useForm<ClientForm>({
    initialState,
    onSubmit: async formData => {
      try {
        // Trim all string fields before validation and submission
        const cleanedData = {
          ...formData,
          clientName: formInput.clientName?.trim(),
          displayName: formData.displayName?.trim() || undefined,
          mobileNumber: addCountryCode(formData.mobileNumber) || undefined,
          whatsappNumber: addCountryCode(formData.whatsappNumber) || undefined,
          emailId: formData.emailId?.trim() || undefined,
          notes: formData.notes?.trim() || undefined,
          groups: Array.from(new Set(formData.groups || [])),
          partnerId: formData.partnerId,
        };

        console.log('Cleaned form data:', cleanedData);

        if (editMode && clientData) {
          cleanedData.id = clientData.id;
        }

        if (!cleanedData.clientName) {
          setFieldErrors(prev => ({
            ...prev,
            clientName: t('addClient.errors.clientNameRequired', 'Client name is required'),
          }));
          showError(t('addClient.errors.provideValidClientName', 'Please provide a valid Client Name'));
          return;
        }

        // Only validate the client name field directly
        try {
          const nameSchema = clientFormSchema.shape.clientName;
          nameSchema.parse(cleanedData.clientName);
        } catch (validationError) {
          if (validationError instanceof z.ZodError) {
            setFieldErrors(prev => ({
              ...prev,
              clientName: validationError.errors[0].message,
            }));
            showError(t('addClient.errors.provideValidClientName', 'Please provide a valid Client Name'));
            return;
          }
        }

        console.log('Submitting form data:', cleanedData);

        const response = await PartnerService.addClient(cleanedData);
        if (response.success) {
          Toast.show({
            type: 'success',
            text1: editMode
              ? t('addClient.success.clientUpdated', 'Client updated successfully')
              : t('addClient.success.clientAdded', 'Client added successfully'),
          });
          setClientsUpdated(prev => !prev);
          navigation.goBack();
        } else {
          Toast.show({
            type: 'error',
            text1: editMode ? t('addClient.errors.updateError', 'Error updating client') : t('addClient.errors.addError', 'Error adding client'),
          });
        }
      } catch (err) {
        console.error('Error in onSubmit:', err);
        Toast.show({
          type: 'error',
          text1: t('addClient.errors.unexpectedError', 'An unexpected error occurred'),
        });
      }
    },
  });

  useEffect(() => {
    setFormInput(initialState);
  }, [setFormInput, initialState]);

  const handleFieldChange = useCallback(
    (field: keyof ClientForm, value: string | boolean | number[]) => {
      handleInputChange(field, value);
      if (field === 'clientName' || (value && value !== '')) {
        validateField(field, value);
      } else {
        setFieldErrors(prev => ({ ...prev, [field]: '' }));
      }
    },
    [handleInputChange, validateField],
  );

  const scrollToEnd = (delay: number = 100) => {
    // Ensure delay is a positive number and within reasonable bounds
    const safeDelay = Math.max(0, Math.min(delay, 1000));

    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, safeDelay);
  };

  const handleGroupsChange = useCallback(
    (groups: number[]) => {
      handleInputChange('groups', groups);
    },
    [handleInputChange],
  );

  return (
    <>
      {
        Platform.OS === 'android' && (
          <Header<PartnerDrawerParamList>
            title={editMode ? t('addClient.headers.editClient', 'Edit Client') : t('addClient.headers.addClient', 'Add Client')}
            backButton={true}
            navigation={navigation}
          />
        )
      }
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}>
            <View style={styles.formContainer}>
              <MaterialTextInput<ClientForm>
                style={styles.input}
                label={t('addClient.labels.clientName', 'Client Name*')}
                field="clientName"
                formInput={formInput}
                setFormInput={handleFieldChange}
                mode="outlined"
                placeholder={t('addClient.placeholders.clientName', 'Eg. John Doe')}
                errorMessage={fieldErrors.clientName}
              />

              <MaterialTextInput<ClientForm>
                style={styles.input}
                label={t('addClient.labels.displayName', 'Display Name')}
                field="displayName"
                formInput={formInput}
                setFormInput={handleFieldChange}
                mode="outlined"
                placeholder={t('addClient.placeholders.displayName', 'Eg. John Doe')}
                errorMessage={fieldErrors.displayName}
              />

              <MaterialTextInput<ClientForm>
                style={styles.input}
                label={t('addClient.labels.mobileNumber', 'Mobile Number')}
                field="mobileNumber"
                formInput={formInput}
                setFormInput={handleFieldChange}
                mode="outlined"
                placeholder={t('addClient.placeholders.mobileNumber', 'Eg. 1234567890')}
                keyboardType="number-pad"
                errorMessage={fieldErrors.mobileNumber}
              />

              <MaterialTextInput<ClientForm>
                style={styles.input}
                label={t('addClient.labels.whatsappNumber', 'WhatsApp Number')}
                field="whatsappNumber"
                formInput={formInput}
                setFormInput={handleFieldChange}
                mode="outlined"
                placeholder={t('addClient.placeholders.whatsappNumber', 'Eg. 1234567890')}
                keyboardType="number-pad"
                errorMessage={fieldErrors.whatsappNumber}
              />

              <MaterialTextInput<ClientForm>
                style={styles.input}
                label={t('addClient.labels.email', 'Email')}
                field="emailId"
                formInput={formInput}
                setFormInput={handleFieldChange}
                mode="outlined"
                placeholder={t('addClient.placeholders.email', 'Eg. email@example.com')}
                keyboardType="email-address"
                autoCapitalize="none"
                errorMessage={fieldErrors.emailId}
              />

              <GroupsToggleComponent
                selectedGroups={formInput.groups || []}
                onGroupsChange={handleGroupsChange}
              />

              <MaterialTextInput<ClientForm>
                style={styles.input}
                label={t('addClient.labels.notes', 'Notes')}
                field="notes"
                formInput={formInput}
                setFormInput={handleFieldChange}
                mode="outlined"
                placeholder={t('addClient.placeholders.notes', 'Add additional notes')}
                multiline
                numberOfLines={4}
                onFocus={() => scrollToEnd()}
              />
            </View>

            <Button
              mode="contained"
              onPress={handleSubmit}
              buttonColor={theme.primaryColor}
              textColor="white"
              loading={formLoading}>
              {t('addClient.buttons.submit', 'Submit')}
            </Button>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 110,
    gap: 16,
  },
  input: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    gap: 16,
  },
});

export default AddClientScreen;
