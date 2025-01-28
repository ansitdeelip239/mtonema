import React, {useRef, useMemo, useCallback} from 'react';
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

type Props = NativeStackScreenProps<ClientStackParamList, 'AddClientScreen'>;

const AddClientScreen: React.FC<Props> = ({navigation}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const {groups, dataUpdated, setDataUpdated} = usePartner();
  const {user} = useAuth();

  const {
    formInput,
    handleInputChange,
    loading: formLoading,
    onSubmit: handleSubmit,
  } = useForm<ClientForm>({
    initialState: {
      ClientName: '',
      DisplayName: '',
      MobileNumber: '',
      WhatsappNumber: '',
      EmailId: '',
      Notes: '',
      Groups: [],
      PartnerId: user?.Email as string,
    },
    onSubmit: async formData => {
      try {
        const response = await PartnerService.addClient(formData);
        if (response.Success) {
          Toast.show({
            type: 'success',
            text1: 'Client added successfully',
          });
          setDataUpdated(!dataUpdated);
          navigation.goBack();
        } else {
          Toast.show({
            type: 'error',
            text1: 'Failed to add client',
          });
          throw new Error('Failed to add client');
        }
        console.log('Client added successfully:', response);
      } catch (error) {
        console.error('Error in onSubmit:', error);
      }
    },
  });

  const scrollToEnd = (delay = 100) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    }, delay);
  };

  const toggleGroup = useCallback(
    (groupId: number) => {
      const updatedGroups = formInput.Groups.includes(groupId)
        ? formInput.Groups.filter(id => id !== groupId)
        : [...formInput.Groups, groupId];
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
                formInput.Groups.some(g => g === group.Id) && {
                  backgroundColor: group.Color.Name,
                  borderColor: group.Color.Name,
                },
              ]}
              onPress={() => toggleGroup(group.Id)}>
              <Text
                style={[
                  styles.groupButtonText,
                  formInput.Groups.some(g => g === group.Id) &&
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
          label="Client Name"
          field="ClientName"
          formInput={formInput}
          setFormInput={handleInputChange}
          mode="outlined"
          placeholder="Eg. John Doe"
        />

        <MaterialTextInput<ClientForm>
          style={styles.input}
          label="Display Name"
          field="DisplayName"
          formInput={formInput}
          setFormInput={handleInputChange}
          mode="outlined"
          placeholder="Eg. John Doe"
        />

        <MaterialTextInput<ClientForm>
          style={styles.input}
          label="Mobile Number"
          field="MobileNumber"
          formInput={formInput}
          setFormInput={handleInputChange}
          mode="outlined"
          placeholder="Eg. 1234567890"
          keyboardType="number-pad"
        />

        <MaterialTextInput<ClientForm>
          style={styles.input}
          label="WhatsApp Number"
          field="WhatsappNumber"
          formInput={formInput}
          setFormInput={handleInputChange}
          mode="outlined"
          placeholder="Eg. 1234567890"
          keyboardType="number-pad"
        />

        <MaterialTextInput<ClientForm>
          style={styles.input}
          label="Email"
          field="EmailId"
          formInput={formInput}
          setFormInput={handleInputChange}
          mode="outlined"
          placeholder="Eg. email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {renderGroupToggleButtons}

        <MaterialTextInput<ClientForm>
          style={styles.input}
          label="Notes"
          field="Notes"
          formInput={formInput}
          setFormInput={handleInputChange}
          mode="outlined"
          placeholder="Add additional notes"
          multiline
          numberOfLines={4}
          onFocus={() => scrollToEnd()}
        />
      </>
    ),
    [formInput, handleInputChange, renderGroupToggleButtons],
  );

  return (
    <>
      <Header<PartnerDrawerParamList> title="Add Client">
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </Header>
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
  backButton: {
    backgroundColor: Colors.main,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
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
