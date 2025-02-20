import React, {useRef, useMemo, useCallback, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Text,
} from 'react-native';
import {Button} from 'react-native-paper';
import {ClientForm} from '../../../types';
import {MaterialTextInput} from '../../../components/MaterialTextInput';
import Colors from '../../../constants/Colors';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ClientStackParamList} from '../../../navigator/components/ClientScreenStack';
import Header from '../../../components/Header';
import {PartnerDrawerParamList} from '../../../types/navigation';
import useForm from '../../../hooks/useForm';
import PartnerService from '../../../services/PartnerService';
import {usePartner} from '../../../context/PartnerProvider';
import Toast from 'react-native-toast-message';
import {useAuth} from '../../../hooks/useAuth';
import {z} from 'zod';
import clientFormSchema from '../../../schema/ClientFormSchema';
import { useDialog } from '../../../hooks/useDialog';

type Props = NativeStackScreenProps<ClientStackParamList, 'AddClientScreen'>;

const AddClientScreen: React.FC<Props> = ({navigation, route}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const {groups, setClientsUpdated} = usePartner();
  const {user} = useAuth();
  const {showError} = useDialog();

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const editMode = route.params?.editMode;
  const clientData = route.params?.clientData;

  const initialState = useMemo(() => {
    if (editMode && clientData) {
      return {
        ClientName: clientData.ClientName || '',
        DisplayName: clientData.DisplayName || '',
        MobileNumber: clientData.MobileNumber || '',
        WhatsappNumber: clientData.WhatsappNumber || '',
        EmailId: clientData.EmailId || '',
        Notes: clientData.Notes || '',
        Groups: clientData.Groups?.map(group => group.ID) || [],
        PartnerId: user?.email ?? '',
      };
    }

    return {
      ClientName: '',
      DisplayName: '',
      MobileNumber: '',
      WhatsappNumber: '',
      EmailId: '',
      Notes: '',
      Groups: [],
      PartnerId: user?.email ?? '',
    };
  }, [editMode, clientData, user]);

  const validateField = useCallback((field: keyof ClientForm, value: any) => {
    if (field !== 'ClientName' && (!value || value === '')) {
      setFieldErrors(prev => ({...prev, [field]: ''}));
      return;
    }

    try {
      const schema = clientFormSchema.shape[field];
      schema.parse(value);
      setFieldErrors(prev => ({...prev, [field]: ''}));
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
        const cleanedData = {
          ...formData,
          DisplayName: formData.DisplayName || undefined,
          MobileNumber: formData.MobileNumber || undefined,
          WhatsappNumber: formData.WhatsappNumber || undefined,
          EmailId: formData.EmailId || undefined,
          Notes: formData.Notes || '',
          Groups: formData.Groups || [],
        };

        const validatedData = clientFormSchema.parse(cleanedData);

        if (editMode && clientData) {
          validatedData.Id = clientData.Id;
        }

        const response = await PartnerService.addClient(validatedData);
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
        if (err instanceof z.ZodError) {
          const errors: Record<string, string> = {};
          err.errors.forEach(error => {
            if (error.path[0]) {
              errors[error.path[0]] = error.message;
            }
          });
          setFieldErrors(errors);
          // Toast.show({
          //   type: 'error',
          //   text1: 'Please provide a valid Client Name',
          // });
          showError('Please provide a valid Client Name');
        } else {
          console.error('Error in onSubmit:', err);
          Toast.show({
            type: 'error',
            text1: 'An unexpected error occurred',
          });
        }
      }
    },
  });

  useEffect(() => {
    setFormInput(initialState);
  }, [setFormInput, initialState]);

  const handleFieldChange = useCallback(
    (field: keyof ClientForm, value: string | boolean | number[]) => {
      handleInputChange(field, value);
      if (field === 'ClientName' || (value && value !== '')) {
        validateField(field, value);
      } else {
        setFieldErrors(prev => ({...prev, [field]: ''}));
      }
    },
    [handleInputChange, validateField],
  );

  const scrollToEnd = (delay = 100) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    }, delay);
  };

  const toggleGroup = useCallback(
    (groupId: number) => {
      const updatedGroups = formInput.Groups?.includes(groupId)
        ? formInput.Groups?.filter(id => id !== groupId)
        : [...(formInput.Groups ?? []), groupId];
      handleInputChange('Groups', updatedGroups);
    },
    [formInput.Groups, handleInputChange],
  );

  const renderGroupToggleButtons = useMemo(
    () => (
      <View style={styles.groupsContainer}>
        <Text style={styles.groupsLabel}>Select Groups</Text>
        <View style={styles.groupButtonsContainer}>
          {groups?.map(group => (
            <TouchableOpacity
              key={group.Id}
              style={[
                styles.groupButton,
                formInput.Groups?.some(g => g === group.Id) && {
                  backgroundColor: group.Color.Name,
                  borderColor: group.Color.Name,
                },
              ]}
              onPress={() => toggleGroup(group.Id)}>
              <Text
                style={[
                  styles.groupButtonText,
                  formInput.Groups?.some(g => g === group.Id) &&
                    styles.groupButtonTextSelected,
                ]}>
                {group.GroupName}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    ),
    [groups, formInput.Groups, toggleGroup],
  );

  const renderForm = useMemo(
    () => (
      <>
        <MaterialTextInput<ClientForm>
          style={styles.input}
          label="Client Name*"
          field="ClientName"
          formInput={formInput}
          setFormInput={handleFieldChange}
          mode="outlined"
          placeholder="Eg. John Doe"
          errorMessage={fieldErrors.ClientName}
        />

        <MaterialTextInput<ClientForm>
          style={styles.input}
          label="Display Name"
          field="DisplayName"
          formInput={formInput}
          setFormInput={handleFieldChange}
          mode="outlined"
          placeholder="Eg. John Doe"
          errorMessage={fieldErrors.DisplayName}
        />

        <MaterialTextInput<ClientForm>
          style={styles.input}
          label="Mobile Number"
          field="MobileNumber"
          formInput={formInput}
          setFormInput={handleFieldChange}
          mode="outlined"
          placeholder="Eg. 1234567890"
          keyboardType="number-pad"
          errorMessage={fieldErrors.MobileNumber}
        />

        <MaterialTextInput<ClientForm>
          style={styles.input}
          label="WhatsApp Number"
          field="WhatsappNumber"
          formInput={formInput}
          setFormInput={handleFieldChange}
          mode="outlined"
          placeholder="Eg. 1234567890"
          keyboardType="number-pad"
          errorMessage={fieldErrors.WhatsappNumber}
        />

        <MaterialTextInput<ClientForm>
          style={styles.input}
          label="Email"
          field="EmailId"
          formInput={formInput}
          setFormInput={handleFieldChange}
          mode="outlined"
          placeholder="Eg. email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          errorMessage={fieldErrors.EmailId}
        />

        {renderGroupToggleButtons}

        <MaterialTextInput<ClientForm>
          style={styles.input}
          label="Notes"
          field="Notes"
          formInput={formInput}
          setFormInput={handleFieldChange}
          mode="outlined"
          placeholder="Add additional notes"
          multiline
          numberOfLines={4}
          onFocus={() => scrollToEnd()}
        />
      </>
    ),
    [formInput, handleFieldChange, renderGroupToggleButtons, fieldErrors],
  );

  return (
    <>
      <Header<PartnerDrawerParamList>
        title={editMode ? 'Edit Client' : 'Add Client'}
        backButton={true}
        navigation={navigation}
      />
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
            {renderForm}

            <Button
              mode="contained"
              onPress={handleSubmit}
              buttonColor={Colors.main}
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
  },
  input: {
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  groupsContainer: {
    marginBottom: 16,
  },
  groupsLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000',
  },
  groupButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  groupButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.main,
  },
  groupButtonText: {
    color: Colors.main,
    fontSize: 14,
  },
  groupButtonTextSelected: {
    color: '#fff',
  },
});

export default AddClientScreen;
