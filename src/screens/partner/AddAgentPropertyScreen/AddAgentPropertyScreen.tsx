import React, {useRef, useMemo, useCallback, useState, useEffect} from 'react';
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
import {Button, Switch} from 'react-native-paper';
import {MaterialTextInput} from '../../../components/MaterialTextInput';
import {useMaster} from '../../../context/MasterProvider';
import FilterOption from '../../../components/FilterOption';
import {formatCurrency} from '../../../utils/currency';
import Colors from '../../../constants/Colors';
import PartnerService from '../../../services/PartnerService';
import {useAuth} from '../../../hooks/useAuth';
import useForm from '../../../hooks/useForm';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import Header from '../../../components/Header';
import {
  PartnerBottomTabParamList,
  PartnerDrawerParamList,
} from '../../../types/navigation';
import agentPropertyFormSchema, {
  AgentPropertyFormType,
  apiSubmissionSchema,
} from '../../../schema/AgentPropertyFormSchema';
import {z} from 'zod';
import {usePartner} from '../../../context/PartnerProvider';
import Toast from 'react-native-toast-message';
import {SearchInput} from './components/SearchInput';
import {useKeyboard} from '../../../hooks/useKeyboard';

type Props = BottomTabScreenProps<PartnerBottomTabParamList, 'AddProperty'>;

const AddAgentPropertyScreen: React.FC<Props> = ({navigation, route}) => {
  const [errors, setErrors] = useState<
    Partial<Record<keyof AgentPropertyFormType, string>>
  >({});

  const scrollViewRef = useRef<ScrollView>(null);
  const {user} = useAuth();
  const {masterData} = useMaster();
  const {setAgentPropertyUpdated} = usePartner();
  const {keyboardVisible} = useKeyboard();

  const editMode = route.params?.editMode;
  const propertyData = route.params?.propertyData;

  const initialState = useMemo(() => {
    if (editMode && propertyData) {
      return {
        agentName: propertyData.AgentName || '',
        agentContactNo: propertyData.AgentContactNo || '',
        propertyLocation: propertyData.PropertyLocation || '',
        propertyType: propertyData.PropertyType?.MasterDetailName || '',
        bhkType: propertyData.FlatSize?.MasterDetailName || '',
        demandPrice: propertyData.DemandPrice?.toString() || '',
        securityDepositAmount:
          propertyData.SecurityDepositAmount?.toString() || '',
        negotiable: propertyData.Negotiable || false,
        propertyNotes: propertyData.PropertyNotes || '',
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
        fieldSchema.parse({[field]: value});
        setErrors(prev => ({...prev, [field]: undefined}));
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldError = error.errors[0]?.message || 'Invalid input';
          setErrors(prev => ({...prev, [field]: fieldError}));
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

        const request = {
          AgentName: validatedApiData.agentName,
          AgentContactNo: validatedApiData.agentContactNo,
          PropertyLocation: validatedApiData.propertyLocation,
          PropertyType: validatedApiData.propertyType,
          FlatSize: validatedApiData.bhkType,
          DemandPrice: validatedApiData.demandPrice.toString(),
          SecurityDepositAmount:
            validatedApiData.securityDepositAmount.toString(),
          Negotiable: validatedApiData.negotiable,
          PropertyNotes: validatedApiData.propertyNotes,
          Status: 1,
          Id: editMode && propertyData ? propertyData.Id : 0,
          PriceUnit: null,
          EmailId: user?.Email || '',
        };

        const response = await PartnerService.updateAgentProperty(request);
        if (response.Success) {
          resetForm();
          setErrors({});
          Toast.show({
            type: 'success',
            text1: editMode
              ? 'Property updated successfully'
              : 'Property added successfully',
          });
          setAgentPropertyUpdated(prev => !prev);
          navigation.navigate('Property');
        } else {
          Toast.show({
            type: 'error',
            text1: 'Failed to update agent property',
          });
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
        Toast.show({
          type: 'error',
          text1: 'Please check your input and try again',
        });
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
      scrollViewRef.current?.scrollToEnd({animated: true});
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
        <SearchInput<AgentPropertyFormType>
          field="agentName"
          formInput={formInput}
          handleFieldChange={handleFieldChange}
          errors={errors}
          label="Agent Name"
          placeholder="Eg. John Doe"
          searchType="AgentName"
          onAgentSelect={(agentName, contactNo) => {
            handleFieldChange('agentName', agentName);
            handleFieldChange('agentContactNo', contactNo);
          }}
        />

        <MaterialTextInput<AgentPropertyFormType>
          style={styles.input}
          label="Agent Contact No."
          field="agentContactNo"
          formInput={formInput}
          setFormInput={handleFieldChange}
          mode="outlined"
          placeholder="1234567890"
          keyboardType="number-pad"
          errorMessage={errors.agentContactNo}
        />

        <SearchInput<AgentPropertyFormType>
          field="propertyLocation"
          formInput={formInput}
          handleFieldChange={handleFieldChange}
          errors={errors}
          label="Property Location"
          placeholder="Navi Mumbai, Thane, etc."
          searchType="AgentPropertyLocation"
        />

        <FilterOption
          label="Property Type"
          options={masterData?.AgentPropertyType || []}
          selectedValue={formInput.propertyType}
          onSelect={value => handleFieldSelect('propertyType', value)}
          error={errors.propertyType}
        />

        <FilterOption
          label="BHK Type"
          options={masterData?.BhkType || []}
          selectedValue={formInput.bhkType}
          onSelect={value => handleFieldSelect('bhkType', value)}
          error={errors.bhkType}
        />

        <MaterialTextInput<AgentPropertyFormType>
          style={styles.input}
          label="Demand Price"
          field="demandPrice"
          formInput={formInput}
          setFormInput={handleFieldChange}
          mode="outlined"
          placeholder="Enter amount"
          keyboardType="number-pad"
          rightComponent={<Text>{formatCurrency(formInput.demandPrice)}</Text>}
          maxLength={10}
          errorMessage={errors.demandPrice}
        />

        <MaterialTextInput<AgentPropertyFormType>
          style={styles.input}
          label="Security Deposit Amount"
          field="securityDepositAmount"
          formInput={formInput}
          setFormInput={handleFieldChange}
          mode="outlined"
          placeholder="Enter deposit amount"
          keyboardType="number-pad"
          onFocus={() => scrollToEnd()}
          rightComponent={
            <Text>{formatCurrency(formInput.securityDepositAmount)}</Text>
          }
          maxLength={10}
          errorMessage={errors.securityDepositAmount}
        />

        <View style={styles.switchContainer}>
          <Text>Negotiable</Text>
          <Switch
            value={formInput.negotiable}
            onValueChange={value => handleFieldChange('negotiable', value)}
          />
        </View>

        <MaterialTextInput<AgentPropertyFormType>
          style={styles.input}
          label="Property Notes"
          field="propertyNotes"
          formInput={formInput}
          setFormInput={handleFieldChange}
          mode="outlined"
          placeholder="Add additional details"
          multiline
          numberOfLines={4}
          onFocus={() => scrollToEnd()}
          errorMessage={errors.propertyNotes}
        />
      </>
    ),
    [
      formInput,
      handleFieldChange,
      handleFieldSelect,
      masterData,
      scrollToEnd,
      errors,
    ],
  );

  return (
    <>
      <Header<PartnerDrawerParamList>
        title={editMode ? "Edit Agent's Property" : "Add Agent's Property"}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={[
              styles.scrollContainer,
              {paddingBottom: keyboardVisible ? 60 : 120} as const,
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}>
            {renderPropertyInputs}

            <Button
              mode="contained"
              onPress={handleSubmit}
              buttonColor={Colors.main}
              loading={loading}>
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
  },
  input: {
    marginBottom: 16,
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
