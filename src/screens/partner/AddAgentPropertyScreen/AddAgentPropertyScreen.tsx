import React, {useRef, useMemo, useCallback} from 'react';
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
import {AgentPropertyForm, AgentPropertyRequestModel} from '../../../types';
import {MaterialTextInput} from '../../../components/MaterialTextInput';
import {useMaster} from '../../../context/MasterProvider';
import FilterOption from '../../../components/FilterOption';
import formatCurrency from '../../../utils/currency';
import Colors from '../../../constants/Colors';
import PartnerService from '../../../services/PartnerService';
import {useAuth} from '../../../hooks/useAuth';
import useForm from '../../../hooks/useForm';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AgentStackParamList} from '../../../navigator/PartnerNavigator';

type Props = NativeStackScreenProps<AgentStackParamList, 'AddAgentProperty'>;

const AddAgentPropertyScreen: React.FC<Props> = ({navigation}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const {user} = useAuth();
  const {masterData} = useMaster();

  const {
    formInput,
    handleInputChange,
    handleSelect,
    loading,
    onSubmit: handleSubmit,
  } = useForm<AgentPropertyForm>({
    initialState: {
      agentName: '',
      agentContactNo: '',
      propertyLocation: '',
      propertyType: '',
      bhkType: '',
      demandPrice: '',
      securityDepositAmount: '',
      negotiable: false,
      propertyNotes: '',
    },
    onSubmit: async formData => {
      const request: AgentPropertyRequestModel = {
        AgentName: formData.agentName,
        AgentContactNo: formData.agentContactNo,
        PropertyLocation: formData.propertyLocation,
        PropertyType: formData.propertyType,
        FlatSize: formData.bhkType,
        DemandPrice: formData.demandPrice,
        SecurityDepositAmount: formData.securityDepositAmount,
        Negotiable: formData.negotiable,
        PropertyNotes: formData.propertyNotes,
        Status: 1,
        Id: 0,
        PriceUnit: null,
        EmailId: user?.Email || '',
      };

      try {
        const response = await PartnerService.updateAgentProperty(request);
        if (response.Success) {
          navigation.navigate('AgentPropertyList');
        } else {
          throw new Error('Failed to update agent property');
        }
      } catch (error) {
        console.error('Error in onSubmit:', error);
      }
    },
  });

  const scrollToEnd = useCallback((delay = 100) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    }, delay);
  }, []);

  const renderPropertyInputs = useMemo(
    () => (
      <>
        <MaterialTextInput<AgentPropertyForm>
          style={styles.input}
          label="Agent Name"
          field="agentName"
          formInput={formInput}
          setFormInput={handleInputChange}
          mode="outlined"
          placeholder="John Doe"
        />

        <MaterialTextInput<AgentPropertyForm>
          style={styles.input}
          label="Agent Contact No."
          field="agentContactNo"
          formInput={formInput}
          setFormInput={handleInputChange}
          mode="outlined"
          placeholder="1234567890"
          keyboardType="numeric"
        />

        <MaterialTextInput<AgentPropertyForm>
          style={styles.input}
          label="Property Location"
          field="propertyLocation"
          formInput={formInput}
          setFormInput={handleInputChange}
          mode="outlined"
          placeholder="Navi Mumbai, Thane, etc."
        />

        <FilterOption
          label="Property Type"
          options={masterData?.AgentPropertyType || []}
          selectedValue={formInput.propertyType}
          onSelect={value => handleSelect('propertyType', value)}
        />

        <FilterOption
          label="BHK Type"
          options={masterData?.BhkType || []}
          selectedValue={formInput.bhkType}
          onSelect={value => handleSelect('bhkType', value)}
        />

        <MaterialTextInput<AgentPropertyForm>
          style={styles.input}
          label="Demand Price"
          field="demandPrice"
          formInput={formInput}
          setFormInput={handleInputChange}
          mode="outlined"
          placeholder="Enter amount"
          keyboardType="numeric"
          rightComponent={<Text>{formatCurrency(formInput.demandPrice)}</Text>}
          maxLength={10}
        />

        <MaterialTextInput<AgentPropertyForm>
          style={styles.input}
          label="Security Deposit Amount"
          field="securityDepositAmount"
          formInput={formInput}
          setFormInput={handleInputChange}
          mode="outlined"
          placeholder="Enter deposit amount"
          keyboardType="numeric"
          onFocus={() => scrollToEnd()}
          rightComponent={
            <Text>{formatCurrency(formInput.securityDepositAmount)}</Text>
          }
          maxLength={10}
        />

        <View style={styles.switchContainer}>
          <Text>Negotiable</Text>
          <Switch
            value={formInput.negotiable}
            onValueChange={value => handleInputChange('negotiable', value)}
          />
        </View>

        <MaterialTextInput<AgentPropertyForm>
          style={styles.input}
          label="Property Notes"
          field="propertyNotes"
          formInput={formInput}
          setFormInput={handleInputChange}
          mode="outlined"
          placeholder="Add additional details"
          multiline
          numberOfLines={4}
          onFocus={() => scrollToEnd()}
        />
      </>
    ),
    [formInput, handleInputChange, handleSelect, masterData, scrollToEnd],
  );

  return (
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100,
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
