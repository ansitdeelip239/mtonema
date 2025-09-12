import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {View, StyleSheet, ScrollView, Switch, Platform} from 'react-native';
import {PlansStackParamList} from '../../../navigator/components/PlansStack';
import Header from '../../../components/Header';
import useForm from '../../../hooks/useForm';
import {MaterialTextInput} from '../../../components/MaterialTextInput';
import {Button, Text} from 'react-native-paper';
import FilterOption from '../../../components/FilterOption';
import {useMaster} from '../../../context/MasterProvider';
import {useTheme} from '../../../context/ThemeProvider';
import PlansFormSchema from '../../../schema/PlansFormSchema';
import PartnerService from '../../../services/PartnerService';
import Toast from 'react-native-toast-message';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';

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
  const {t} = useTranslation();
  const isIOS = Platform.OS === 'ios';

  const editMode = route?.params?.editMode;
  const planData = route?.params?.planData;

  const initialState: PlansForm =
    editMode && planData
      ? {
          planName: planData.planName || '',
          description: planData.description || '',
          price: planData.price ? String(planData.price / 100) : '',
          billingCycle: planData.billingCycle || 'Monthly',
          durationDays: planData.durationDays
            ? String(planData.durationDays)
            : '',
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

  const {formInput, handleInputChange, onSubmit} = useForm<PlansForm>({
    initialState,
    onSubmit: async data => {
      const result = PlansFormSchema.safeParse(data);
      if (!result.success) {
        const firstError = result.error.issues[0];
        Toast.show({
          type: 'error',
          text1:
            firstError.message ||
            t(
              'billing.addPlan.messages.error.validation',
              'Please check your input',
            ),
        });
        return;
      }

      const payload = {
        planName: data.planName.trim(),
        description: data.description?.trim() || '',
        price: parseInt(data.price, 10),
        billingCycle: data.billingCycle,
        durationDays: parseInt(data.durationDays, 10),
        maxUsers: parseInt(data.maxUsers, 10),
        isTrial: data.isTrial,
      };

      setLoading(true);
      try {
        let response;
        if (editMode && planData?.id) {
          response = await PartnerService.updatePaymentPlan(
            payload,
            planData.id,
          );
        } else {
          response = await PartnerService.addPaymentPlan(payload);
        }
        if (response && response.data) {
          Toast.show({
            type: 'success',
            text1: editMode
              ? t(
                  'billing.addPlan.messages.success.edit',
                  'Plan updated successfully',
                )
              : t(
                  'billing.addPlan.messages.success.add',
                  'Plan added successfully',
                ),
          });
          navigation.goBack();
        } else {
          Toast.show({
            type: 'error',
            text1: editMode
              ? t(
                  'billing.addPlan.messages.error.edit',
                  'Failed to update plan',
                )
              : t('billing.addPlan.messages.error.add', 'Failed to add plan'),
          });
        }
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: editMode
            ? t(
                'billing.addPlan.messages.error.editGeneric',
                'An error occurred while updating the plan',
              )
            : t(
                'billing.addPlan.messages.error.addGeneric',
                'An error occurred while saving the plan',
              ),
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const [loading, setLoading] = useState(false);

  return (
    <View style={styles.container}>
      {!isIOS && (
        <Header
          title={
            editMode
              ? t('billing.addPlan.title.edit', 'Edit Plan')
              : t('billing.addPlan.title.add', 'Add Plan')
          }
          backButton
          onBackPress={() => navigation.goBack()}
        />
      )}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <MaterialTextInput<PlansForm>
            style={styles.input}
            label={t('billing.addPlan.form.planName', 'Plan Name*')}
            field="planName"
            formInput={formInput}
            setFormInput={handleInputChange}
            mode="outlined"
            placeholder={t(
              'billing.addPlan.placeholders.planName',
              'Eg. Premium Plan',
            )}
          />
          <MaterialTextInput<PlansForm>
            style={styles.input}
            label={t('billing.addPlan.form.description', 'Description')}
            field="description"
            formInput={formInput}
            setFormInput={handleInputChange}
            mode="outlined"
            placeholder={t(
              'billing.addPlan.placeholders.description',
              'Describe the plan',
            )}
            multiline
            numberOfLines={3}
          />
          <MaterialTextInput<PlansForm>
            style={styles.input}
            label={t('billing.addPlan.form.price', 'Price (₹)')}
            field="price"
            formInput={formInput}
            setFormInput={handleInputChange}
            mode="outlined"
            placeholder={t('billing.addPlan.placeholders.price', 'Eg. 999')}
            keyboardType="number-pad"
          />
          {/* Billing Cycle Toggle using FilterOption */}
          <View style={styles.billingCycleView}>
            <FilterOption
              label={t('billing.addPlan.form.billingCycle', 'Billing Cycle')}
              options={masterData?.BillingCycle || []}
              selectedValue={formInput.billingCycle}
              onSelect={val => handleInputChange('billingCycle', val)}
            />
          </View>
          <MaterialTextInput<PlansForm>
            style={styles.input}
            label={t('billing.addPlan.form.duration', 'Duration (Days)')}
            field="durationDays"
            formInput={formInput}
            setFormInput={handleInputChange}
            mode="outlined"
            placeholder={t('billing.addPlan.placeholders.duration', 'Eg. 30')}
            keyboardType="number-pad"
          />
          <MaterialTextInput<PlansForm>
            style={styles.input}
            label={t('billing.addPlan.form.maxUsers', 'Max Users')}
            field="maxUsers"
            formInput={formInput}
            setFormInput={handleInputChange}
            mode="outlined"
            placeholder={t('billing.addPlan.placeholders.maxUsers', 'Eg. 5')}
            keyboardType="number-pad"
          />
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>
              {t('billing.addPlan.form.isTrial', 'Is Trial?')}
            </Text>
            <Switch
              value={formInput.isTrial}
              onValueChange={val => handleInputChange('isTrial', val)}
              trackColor={{false: '#767577', true: '#53a20e'}}
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
          style={styles.submitBtn}>
          {t('common.actions.submit', 'Submit')}
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
  billingCycleView: {
    marginBottom: 8,
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
