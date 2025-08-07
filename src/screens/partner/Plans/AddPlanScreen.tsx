import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {View, StyleSheet, ScrollView, Switch} from 'react-native';
import {PlansStackParamList} from '../../../navigator/components/PlansStack';
import Header from '../../../components/Header';
import useForm from '../../../hooks/useForm';
import {MaterialTextInput} from '../../../components/MaterialTextInput';
import {Button, Text} from 'react-native-paper';
import FilterOption from '../../../components/FilterOption';
import {useMaster} from '../../../context/MasterProvider';
import { useTheme } from '../../../context/ThemeProvider';
import PlansFormSchema from '../../../schema/PlansFormSchema';
import PartnerService from '../../../services/PartnerService';
import Toast from 'react-native-toast-message';
import { useState } from 'react';
import { convertPaiseToRupees } from '../../../utils/currency';

type Props = NativeStackScreenProps<PlansStackParamList, 'Add Plan Screen'> & {
  route: {
    params?: {
      editMode?: boolean;
      planData?: any;
    };
  };
};

interface PlansForm {
planName: string;
description: string;
price: string;
billingCycle: string;
durationDays: string;
maxUsers: string;
isTrial: boolean;
}

const AddPlanScreen: React.FC<Props> = ({navigation, route}) => {
  const {masterData} = useMaster();
  const {theme} = useTheme();

  const editMode = route?.params?.editMode;
  const planData = route?.params?.planData;

  const initialState: PlansForm = editMode && planData
    ? {
        planName: planData.planName || '',
        description: planData.description || '',
        price: planData.price ? String(planData.price / 100) : '',
        billingCycle: planData.billingCycle || 'Monthly',
        durationDays: planData.durationDays ? String(planData.durationDays) : '',
        maxUsers: planData.maxUsers ? String(planData.maxUsers) : '',
        isTrial: !!planData.isTrial,
      }
    : {
        planName: '',
        description: '',
        price: '',
        billingCycle: 'Monthly',
        durationDays: '',
        maxUsers: '',
        isTrial: false,
      };

  const {formInput, handleInputChange, loading: formLoading, onSubmit, setFormInput} = useForm<PlansForm>({
    initialState,
    onSubmit: async data => {
      const result = PlansFormSchema.safeParse(data);
      if (!result.success) {
        const firstError = result.error.errors[0];
        Toast.show({
          type: 'error',
          text1: firstError.message || 'Please check your input',
        });
        return;
      }

      const payload = {
        planName: data.planName.trim(),
        description: data.description?.trim() || '',
        price: parseInt(data.price),
        billingCycle: data.billingCycle,
        durationDays: parseInt(data.durationDays),
        maxUsers: parseInt(data.maxUsers),
        isTrial: data.isTrial,
      };

      setLoading(true);
      try {
        let response;
        if (editMode && planData?.id) {
          response = await PartnerService.updatePaymentPlan(payload, planData.id);
        } else {
          response = await PartnerService.addPaymentPlan(payload);
        }
        if (response && response.data) {
          Toast.show({
            type: 'success',
            text1: editMode ? 'Plan updated successfully' : 'Plan added successfully',
          });
          navigation.goBack();
        } else {
          Toast.show({
            type: 'error',
            text1: editMode ? 'Failed to update plan' : 'Failed to add plan',
          });
        }
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: editMode ? 'An error occurred while updating the plan' : 'An error occurred while saving the plan',
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const [loading, setLoading] = useState(false);

  return (
    <View style={styles.container}>
      <Header
        title={editMode ? 'Edit Plan' : 'Add Plan'}
        backButton
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <MaterialTextInput<PlansForm>
            style={styles.input}
            label="Plan Name*"
            field="planName"
            formInput={formInput}
            setFormInput={handleInputChange}
            mode="outlined"
            placeholder="Eg. Premium Plan"
          />
          <MaterialTextInput<PlansForm>
            style={styles.input}
            label="Description"
            field="description"
            formInput={formInput}
            setFormInput={handleInputChange}
            mode="outlined"
            placeholder="Describe the plan"
            multiline
            numberOfLines={3}
          />
          <MaterialTextInput<PlansForm>
            style={styles.input}
            label="Price (₹)"
            field="price"
            formInput={formInput}
            setFormInput={handleInputChange}
            mode="outlined"
            placeholder="Eg. 999"
            keyboardType="number-pad"
          />
          {/* Billing Cycle Toggle using FilterOption */}
          <View style={{marginBottom: 8}}>
            <FilterOption
              label="Billing Cycle"
              options={masterData?.BillingCycle || []}
              selectedValue={formInput.billingCycle}
              onSelect={val => handleInputChange('billingCycle', val)}
            />
          </View>
          <MaterialTextInput<PlansForm>
            style={styles.input}
            label="Duration (Days)"
            field="durationDays"
            formInput={formInput}
            setFormInput={handleInputChange}
            mode="outlined"
            placeholder="Eg. 30"
            keyboardType="number-pad"
          />
          <MaterialTextInput<PlansForm>
            style={styles.input}
            label="Max Users"
            field="maxUsers"
            formInput={formInput}
            setFormInput={handleInputChange}
            mode="outlined"
            placeholder="Eg. 5"
            keyboardType="number-pad"
          />
            <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Is Trial?</Text>
            <Switch
              value={formInput.isTrial}
              onValueChange={val => handleInputChange('isTrial', val)}
              trackColor={{ false: '#767577', true: '#53a20e' }}
              thumbColor={formInput.isTrial ? '#ffffff' : '#f4f3f4'}
            />
            </View>
        </View>
        <Button
          mode="contained"
          onPress={onSubmit}
          buttonColor={theme.primaryColor}
          textColor="white"
          loading={loading}
          style={styles.submitBtn}
        >
          Submit
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 110,
    gap: 32,
  },
  formContainer: {
    gap: 16,
  },
  input: {
    flex: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginTop: 8,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  submitBtn: {
    marginTop: 24,
    borderRadius: 6,
    elevation: 2,
  },
});

export default AddPlanScreen;
