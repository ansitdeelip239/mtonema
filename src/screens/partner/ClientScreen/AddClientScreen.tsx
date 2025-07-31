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
import { useAuth } from '../../../hooks/useAuth';
import { z } from 'zod';
import clientFormSchema from '../../../schema/ClientFormSchema';
import { useDialog } from '../../../hooks/useDialog';
import GroupsToggleComponent from './components/GroupsToggle';
import { useTheme } from '../../../context/ThemeProvider';
import { addCountryCode } from '../../../utils/phoneUtils';
import { stripHtmlTags } from '../../../utils/formUtils';

type Props = NativeStackScreenProps<ClientStackParamList, 'AddClientScreen'>;

const AddClientScreen: React.FC<Props> = ({ navigation, route }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const { setClientsUpdated } = usePartner();
  const { user } = useAuth();
  const { theme } = useTheme();
  const { showError } = useDialog();

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
            clientName: 'Client name is required',
          }));
          showError('Please provide a valid Client Name');
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
            showError('Please provide a valid Client Name');
            return;
          }
        }

        console.log('Submitting form data:', cleanedData);

        const response = await PartnerService.addClient(cleanedData);
        if (response.success) {
          Toast.show({
            type: 'success',
            text1: editMode
              ? 'Client updated successfully'
              : 'Client added successfully',
          });
          setClientsUpdated(prev => !prev);
          navigation.goBack();
        } else {
          Toast.show({
            type: 'error',
            text1: editMode ? 'Error updating client' : 'Error adding client',
          });
        }
      } catch (err) {
        console.error('Error in onSubmit:', err);
        Toast.show({
          type: 'error',
          text1: 'An unexpected error occurred',
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
            title={editMode ? 'Edit Client' : 'Add Client'}
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
                label="Client Name*"
                field="clientName"
                formInput={formInput}
                setFormInput={handleFieldChange}
                mode="outlined"
                placeholder="Eg. John Doe"
                errorMessage={fieldErrors.clientName}
              />

              <MaterialTextInput<ClientForm>
                style={styles.input}
                label="Display Name"
                field="displayName"
                formInput={formInput}
                setFormInput={handleFieldChange}
                mode="outlined"
                placeholder="Eg. John Doe"
                errorMessage={fieldErrors.displayName}
              />

              <MaterialTextInput<ClientForm>
                style={styles.input}
                label="Mobile Number"
                field="mobileNumber"
                formInput={formInput}
                setFormInput={handleFieldChange}
                mode="outlined"
                placeholder="Eg. 1234567890"
                keyboardType="number-pad"
                errorMessage={fieldErrors.mobileNumber}
              />

              <MaterialTextInput<ClientForm>
                style={styles.input}
                label="WhatsApp Number"
                field="whatsappNumber"
                formInput={formInput}
                setFormInput={handleFieldChange}
                mode="outlined"
                placeholder="Eg. 1234567890"
                keyboardType="number-pad"
                errorMessage={fieldErrors.whatsappNumber}
              />

              <MaterialTextInput<ClientForm>
                style={styles.input}
                label="Email"
                field="emailId"
                formInput={formInput}
                setFormInput={handleFieldChange}
                mode="outlined"
                placeholder="Eg. email@example.com"
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
                label="Notes"
                field="notes"
                formInput={formInput}
                setFormInput={handleFieldChange}
                mode="outlined"
                placeholder="Add additional notes"
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
              Submit
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
