import React, {useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {Switch, Text} from 'react-native-paper';
import {AgentPropertyForm} from '../../../types';
import {MaterialTextInput} from '../../../components/MaterialTextInput';

export default function AddAgentPropertyScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [formInput, setFormInput] = React.useState<AgentPropertyForm>({
    agentName: '',
    agentContactNo: '',
    propertyLocation: '',
    propertyType: '',
    bhkType: '',
    demandPrice: '',
    securityDepositAmount: '',
    negotiable: false,
    propertyNotes: '',
  });

  const handleInputChange = useCallback(
    (field: keyof AgentPropertyForm, value: string | boolean) => {
      setFormInput(prev => ({...prev, [field]: value}));
    },
    [],
  );

  const scrollToEnd = useCallback((delay = 100) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    }, delay);
  }, []);

  const handleFocus = useCallback(() => {
    scrollToEnd();
  }, [scrollToEnd]);

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
            placeholder="Enter property location"
          />

          <MaterialTextInput<AgentPropertyForm>
            style={styles.input}
            label="Property Type"
            field="propertyType"
            formInput={formInput}
            setFormInput={handleInputChange}
            mode="outlined"
            placeholder="Apartment/Villa/Plot"
          />

          <MaterialTextInput<AgentPropertyForm>
            style={styles.input}
            label="BHK Type"
            field="bhkType"
            formInput={formInput}
            setFormInput={handleInputChange}
            mode="outlined"
            placeholder="1BHK/2BHK/3BHK"
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
            onFocus={handleFocus}
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
            onFocus={handleFocus}
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
