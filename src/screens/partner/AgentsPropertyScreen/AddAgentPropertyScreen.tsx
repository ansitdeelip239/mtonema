import React, { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
} from 'react-native';
import { Button, Switch } from 'react-native-paper';
import { MaterialTextInput } from '../../../components/MaterialTextInput';
import { useMaster } from '../../../context/MasterProvider';
import FilterOption from '../../../components/FilterOption';
import { formatCurrency } from '../../../utils/currency';
import PartnerService from '../../../services/PartnerService';
import useForm from '../../../hooks/useForm';
import Header from '../../../components/Header';
import { PartnerDrawerParamList } from '../../../types/navigation';
import agentPropertyFormSchema, {
  AgentPropertyFormType,
  apiSubmissionSchema,
} from '../../../schema/AgentPropertyFormSchema';
import { z } from 'zod';
import { usePartner } from '../../../context/PartnerProvider';
import Toast from 'react-native-toast-message';
import { SearchInput } from './components/SearchInput';
import { useKeyboard } from '../../../hooks/useKeyboard';
import { useDialog } from '../../../hooks/useDialog';
import { useAuth } from '../../../hooks/useAuth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AgentDataStackParamList } from '../../../navigator/components/AgentDataStack';
import { useTheme } from '../../../context/ThemeProvider';
import { useTranslation } from 'react-i18next';

// type Props = BottomTabScreenProps<PartnerBottomTabParamList, 'AddProperty'>;
type Props = NativeStackScreenProps<
  AgentDataStackParamList,
  'AddAgentDataScreen'
>;

const AddAgentPropertyScreen: React.FC<Props> = ({ navigation, route }) => {
  const [errors, setErrors] = useState<
    Partial<Record<keyof AgentPropertyFormType, string>>
  >({});

  const scrollViewRef = useRef<ScrollView>(null);
  // const {user} = useAuth();
  const { masterData } = useMaster();
  const { setAgentPropertyUpdated } = usePartner();
  const { keyboardVisible } = useKeyboard();
  const { showError } = useDialog();
  const { user } = useAuth();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const editMode = route.params?.editMode;
  const propertyData = route.params?.propertyData;

  const initialState = useMemo(() => {
    if (editMode && propertyData) {
      return {
        agentName: propertyData.agentName || '',
        agentContactNo: propertyData.agentContactNo || '',
        propertyLocation: propertyData.propertyLocation || '',
        propertyType: propertyData.propertyType || '',
        bhkType: propertyData.bhkType || '',
        demandPrice: propertyData.demandPrice?.toString() || '',
        securityDepositAmount:
          propertyData.securityDepositAmount?.toString() || '',
        negotiable: propertyData.negotiable || false,
        propertyNotes: propertyData.propertyNotes || '',
      };
    }

    return {
      agentName: '',
      agentContactNo: '',
      propertyLocation: '',
      propertyType: '',
      bhkType: '',
      demandPrice: '',
      securityDepositAmount: '',
      negotiable: false,
      propertyNotes: '',
    };
  }, [editMode, propertyData]);

  const validateField = useCallback(
    (field: keyof AgentPropertyFormType, value: string | boolean) => {
      try {
        const fieldSchema = agentPropertyFormSchema.pick({
          [field]: true,
        } as Record<typeof field, true>);
        fieldSchema.parse({ [field]: value });
        setErrors(prev => ({ ...prev, [field]: undefined }));
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldError = error.errors[0]?.message || 'Invalid input';
          setErrors(prev => ({ ...prev, [field]: fieldError }));
        }
        return false;
      }
    },
    [],
  );

  const {
    formInput,
    handleInputChange,
    handleSelect,
    loading,
    onSubmit: handleSubmit,
    setFormInput,
    resetForm,
  } = useForm<AgentPropertyFormType>({
    initialState,
    onSubmit: async formData => {
      try {
        const validatedFormData = agentPropertyFormSchema.parse(formData);
        const validatedApiData = apiSubmissionSchema.parse(validatedFormData);

        // Convert empty strings to null before submitting to API
        const request = {
          partnerid: user?.id as number,
          agentName: validatedApiData.agentName.trim(),
          agentContactNo: validatedApiData.agentContactNo.trim(),
          propertyLocation: validatedApiData.propertyLocation.trim(),
          propertyType: validatedApiData.propertyType?.trim() || undefined,
          bhkType: validatedApiData.bhkType?.trim() || undefined,
          demandPrice: validatedApiData.demandPrice
            ? parseInt(validatedApiData.demandPrice.toString().trim(), 10)
            : undefined,
          securityDepositAmount: validatedApiData.securityDepositAmount
            ? parseInt(
              validatedApiData.securityDepositAmount.toString().trim(),
              10,
            )
            : undefined,
          negotiable: validatedApiData.negotiable,
          propertyNotes: validatedApiData.propertyNotes?.trim() || undefined,
        };

        const response = !editMode
          ? await PartnerService.addAgentProperty(request)
          : await PartnerService.updateAgentProperty(
            request,
            propertyData?.id as number,
          );
        if (response.success) {
          resetForm();
          setErrors({});
          Toast.show({
            type: 'success',
            text1: editMode
              ? t('agentProperty.messages.propertyUpdated')
              : t('agentProperty.messages.propertyAdded'),
          });
          setAgentPropertyUpdated(prev => !prev);
          navigation.navigate('AgentDataScreen');
        } else {
          // Toast.show({
          //   type: 'error',
          //   text1: 'Failed to update agent property',
          // });
          showError(t('agentProperty.messages.updateFailed'));
          throw new Error('Failed to update agent property');
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors: Partial<
            Record<keyof AgentPropertyFormType, string>
          > = {};
          error.errors.forEach(err => {
            if (err.path[0]) {
              newErrors[err.path[0] as keyof AgentPropertyFormType] =
                err.message;
            }
          });
          setErrors(newErrors);
        }
        // Toast.show({
        //   type: 'error',
        //   text1: 'Please check your input and try again',
        // });
        showError(t('agentProperty.messages.validationError'));
      }
    },
  });

  const handleFieldChange = useCallback(
    (field: keyof AgentPropertyFormType, value: string | boolean) => {
      validateField(field, value);
      handleInputChange(field, value);
    },
    [handleInputChange, validateField],
  );

  const handleFieldSelect = useCallback(
    (field: keyof AgentPropertyFormType, value: string) => {
      validateField(field, value);
      handleSelect(field, value);
    },
    [handleSelect, validateField],
  );

  const scrollToEnd = useCallback((delay = 100) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, delay);
  }, []);

  useEffect(() => {
    setFormInput(initialState);
  }, [setFormInput, initialState]);

  useEffect(() => {
    return () => {
      setErrors({});
      resetForm();
    };
  }, [resetForm]);

  const renderPropertyInputs = useMemo(
    () => (
      <>
        <View style={styles.formField}>
          <SearchInput<AgentPropertyFormType>
            field="agentName"
            style={styles.input}
            formInput={formInput}
            handleFieldChange={handleFieldChange}
            errors={errors}
            label={t('agentProperty.labels.agentName')}
            placeholder={t('agentProperty.placeholders.agentName')}
            searchType="AgentName"
            onAgentSelect={(agentName, contactNo) => {
              handleFieldChange('agentName', agentName);
              handleFieldChange('agentContactNo', contactNo);
            }}
          />
        </View>

        <View style={styles.formField}>
          <MaterialTextInput<AgentPropertyFormType>
            style={styles.input}
            label={t('agentProperty.labels.agentContactNo')}
            field="agentContactNo"
            formInput={formInput}
            setFormInput={handleFieldChange}
            mode="outlined"
            placeholder={t('agentProperty.placeholders.agentContactNo')}
            keyboardType="number-pad"
            errorMessage={errors.agentContactNo}
          />
        </View>

        <View style={styles.formField}>
          <SearchInput<AgentPropertyFormType>
            field="propertyLocation"
            style={styles.input}
            formInput={formInput}
            handleFieldChange={handleFieldChange}
            errors={errors}
            label={t('agentProperty.labels.propertyLocation')}
            placeholder={t('agentProperty.placeholders.propertyLocation')}
            searchType="AgentPropertyLocation"
          />
        </View>

        <View style={styles.dropdownField}>
          <FilterOption
            label={t('agentProperty.labels.propertyType')}
            options={masterData?.AgentPropertyType || []}
            selectedValue={formInput.propertyType}
            onSelect={value => handleFieldSelect('propertyType', value)}
            error={errors.propertyType}
          />
          <FilterOption
            label={t('agentProperty.labels.bhkType')}
            options={masterData?.BhkType || []}
            selectedValue={formInput.bhkType}
            onSelect={value => handleFieldSelect('bhkType', value)}
            error={errors.bhkType}
          />
        </View>

        <View style={styles.formField}>
          <MaterialTextInput<AgentPropertyFormType>
            style={styles.input}
            label={t('agentProperty.labels.demandPrice')}
            field="demandPrice"
            formInput={formInput}
            setFormInput={handleFieldChange}
            mode="outlined"
            placeholder={t('agentProperty.placeholders.demandPrice')}
            keyboardType="number-pad"
            rightComponent={
              <Text>{formatCurrency(formInput.demandPrice)}</Text>
            }
            maxLength={10}
            errorMessage={errors.demandPrice}
          />
        </View>

        <View style={styles.formField}>
          <MaterialTextInput<AgentPropertyFormType>
            style={styles.input}
            label={t('agentProperty.labels.securityDepositAmount')}
            field="securityDepositAmount"
            formInput={formInput}
            setFormInput={handleFieldChange}
            mode="outlined"
            placeholder={t('agentProperty.placeholders.securityDepositAmount')}
            keyboardType="number-pad"
            onFocus={() => scrollToEnd()}
            rightComponent={
              <Text>{formatCurrency(formInput.securityDepositAmount)}</Text>
            }
            maxLength={10}
            errorMessage={errors.securityDepositAmount}
          />
        </View>

        <View style={styles.switchContainer}>
          <Text>{t('agentProperty.labels.negotiable')}</Text>
          <Switch
            value={formInput.negotiable}
            onValueChange={value => handleFieldChange('negotiable', value)}
          />
        </View>

        <View style={styles.formField}>
          <MaterialTextInput<AgentPropertyFormType>
            style={styles.input}
            label={t('agentProperty.labels.propertyNotes')}
            field="propertyNotes"
            formInput={formInput}
            setFormInput={handleFieldChange}
            mode="outlined"
            placeholder={t('agentProperty.placeholders.propertyNotes')}
            multiline
            numberOfLines={4}
            onFocus={() => scrollToEnd()}
            errorMessage={errors.propertyNotes}
          />
        </View>
      </>
    ),
    [
      formInput,
      handleFieldChange,
      handleFieldSelect,
      masterData,
      scrollToEnd,
      errors,
      t,
    ],
  );

  return (
    <>
      {
        Platform.OS === 'android' && (
          <Header<PartnerDrawerParamList>
            title={editMode ? t('agentProperty.titles.editAgentProperty') : t('agentProperty.titles.addAgentProperty')}
            backButton={true}
            onBackPress={() => navigation.navigate('AgentDataScreen')}
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
            contentContainerStyle={[
              styles.scrollContainer,
              { paddingBottom: keyboardVisible ? 60 : 120 } as const,
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}>
            {renderPropertyInputs}

            <Button
              mode="contained"
              onPress={handleSubmit}
              buttonColor={theme.primaryColor}
              textColor="white"
              loading={loading}>
              {t('agentProperty.buttons.submit')}
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
  },
  input: {
    marginBottom: 0,
  },
  formField: {
    marginBottom: 16,
  },
  dropdownField: {
    marginBottom: 4,
    gap: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default AddAgentPropertyScreen;
