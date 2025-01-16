import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Button,
} from 'react-native';

const PropertyListingForm = () => {
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [expandedField, setExpandedField] = useState('');

  // Options data
  const optionsData = {
    sellerType: [
      'Broker/Agent',
      'Builder',
      'Consultant Firm',
      'Owner',
      'Developer',
    ],
    city: ['Delhi', 'Faridabad', 'Ghaziabad', 'Gurugram', 'Lucknow'],
    propertyFor: ['Rent', 'Sale', 'Lease', 'PG/Hostel'],
    propertyType: ['Coworking', 'Farmhouse', 'Flat', 'Plot', 'Shop', 'Office'],
    furnishedType: ['Furnished', 'Semi-furnished', 'Unfurnished'],
    carParking: ['Covered', 'Open', 'Both', 'None'],
    facing: ['East', 'West', 'North', 'South', 'North-East', 'North-West'],
    amountUnit: ['Thousand', 'Lakh', 'Crore'],
    floor: [
      'Ground',
      '1st',
      '2nd',
      '3rd',
      '4th',
      '5th',
      '6th',
      '7th',
      '8th',
      '9th',
      '10th',
    ],
  };

  const [formData, setFormData] = useState({
    // User Details (Step 1)
    name: '',
    email: '',
    mobile: '',
    sellerType: '',
    city: '',

    // Property Details (Step 2)
    propertyFor: '',
    propertyType: '',
    residentialCommercial: '',
    readyToMove: '',
    liftAvailable: '',
    pantryAvailable: '',
    floor: '',
    furnishedType: '',
    carParking: '',
    facing: '',
    approvedBy: '',
    propertyAddress: '',
    zip: '',
    amount: '',
    amountUnit: '',
    propertyArea: '',
    areaUnit: '',
    description: '',

    // Media Upload (Step 3)
    image: '',
    video: '',
  });

  const handleInputChange = (field: any, value: any) => {
    setFormData({...formData, [field]: value});
    setExpandedField(''); // Close the options after selection
  };

  const renderOptions = (field: keyof typeof optionsData) => {
    const options = optionsData[field];
    const isExpanded = expandedField === field;

    if (!options) { return null; }

    return (
      <View style={styles.optionsWrapper}>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setExpandedField(isExpanded ? '' : field)}>
          <Text style={styles.inputText}>
            {formData[field] || `Select ${field}`}
          </Text>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.optionsContainer}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  formData[field] === option && styles.selectedOption,
                ]}
                onPress={() => handleInputChange(field, option)}>
                <Text
                  style={[
                    styles.optionText,
                    formData[field] === option && styles.selectedOptionText,
                  ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.formSection}>
            <Text style={styles.title}>User Information</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={formData.name}
                onChangeText={text => handleInputChange('name', text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={text => handleInputChange('email', text)}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter mobile number"
                value={formData.mobile}
                onChangeText={text => handleInputChange('mobile', text)}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Seller Type</Text>
              {renderOptions('sellerType')}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>City</Text>
              {renderOptions('city')}
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.formSection}>
            <Text style={styles.title}>Property Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Property For</Text>
              {renderOptions('propertyFor')}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Property Type</Text>
              {renderOptions('propertyType')}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Residential/Commercial</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.residentialCommercial === 'Residential' &&
                      styles.selectedRadio,
                  ]}
                  onPress={() =>
                    handleInputChange('residentialCommercial', 'Residential')
                  }>
                  <Text style={styles.radioText}>Residential</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.residentialCommercial === 'Commercial' &&
                      styles.selectedRadio,
                  ]}
                  onPress={() =>
                    handleInputChange('residentialCommercial', 'Commercial')
                  }>
                  <Text style={styles.radioText}>Commercial</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ready to Move</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.readyToMove === 'Yes' && styles.selectedRadio,
                  ]}
                  onPress={() => handleInputChange('readyToMove', 'Yes')}>
                  <Text style={styles.radioText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.readyToMove === 'No' && styles.selectedRadio,
                  ]}
                  onPress={() => handleInputChange('readyToMove', 'No')}>
                  <Text style={styles.radioText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Lift Available</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.liftAvailable === 'Yes' && styles.selectedRadio,
                  ]}
                  onPress={() => handleInputChange('liftAvailable', 'Yes')}>
                  <Text style={styles.radioText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.liftAvailable === 'No' && styles.selectedRadio,
                  ]}
                  onPress={() => handleInputChange('liftAvailable', 'No')}>
                  <Text style={styles.radioText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pantry Available</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.pantryAvailable === 'Yes' && styles.selectedRadio,
                  ]}
                  onPress={() => handleInputChange('pantryAvailable', 'Yes')}>
                  <Text style={styles.radioText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.pantryAvailable === 'No' && styles.selectedRadio,
                  ]}
                  onPress={() => handleInputChange('pantryAvailable', 'No')}>
                  <Text style={styles.radioText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Floor</Text>
              {renderOptions('floor')}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Furnished Type</Text>
              {renderOptions('furnishedType')}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Car Parking</Text>
              {renderOptions('carParking')}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Direction of Facing</Text>
              {renderOptions('facing')}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Approved By</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter approved by"
                value={formData.approvedBy}
                onChangeText={text => handleInputChange('approvedBy', text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Property Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter property address"
                value={formData.propertyAddress}
                onChangeText={text =>
                  handleInputChange('propertyAddress', text)
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Zip</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter zip code"
                value={formData.zip}
                onChangeText={text => handleInputChange('zip', text)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                value={formData.amount}
                onChangeText={text => handleInputChange('amount', text)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount Unit</Text>
              {renderOptions('amountUnit')}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Property Area</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter property area"
                value={formData.propertyArea}
                onChangeText={text => handleInputChange('propertyArea', text)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Area Unit</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter area unit"
                value={formData.areaUnit}
                onChangeText={text => handleInputChange('areaUnit', text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                // eslint-disable-next-line react-native/no-inline-styles
                style={[styles.input, {height: 100}]}
                placeholder="Enter description"
                value={formData.description}
                onChangeText={text => handleInputChange('description', text)}
                multiline
              />
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.formSection}>
            <Text style={styles.title}>Media Upload</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Image</Text>
              <TextInput
                style={styles.input}
                placeholder="Upload image"
                value={formData.image}
                onChangeText={text => handleInputChange('image', text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Video</Text>
              <TextInput
                style={styles.input}
                placeholder="Upload video"
                value={formData.video}
                onChangeText={text => handleInputChange('video', text)}
              />
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const handleSubmit = () => {
    setShowModal(true);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, {width: `${(step / 3) * 100}%`}]} />
      </View>
      <Text style={styles.progressText}>Step {step} of 3</Text>

      {renderStep()}

      <View style={styles.buttonContainer}>
        {step > 1 && (
          <TouchableOpacity
            style={[styles.navButton, styles.prevButton]}
            onPress={() => setStep(step - 1)}>
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
        )}

        {step < 3 ? (
          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={() => setStep(step + 1)}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.navButton, styles.submitButton]}
            onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal visible={showModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Submitted Details</Text>
          <ScrollView>
            {Object.entries(formData).map(([key, value]) => (
              <View key={key} style={styles.modalItem}>
                <Text style={styles.modalLabel}>{key}:</Text>
                <Text style={styles.modalValue}>{value}</Text>
              </View>
            ))}
          </ScrollView>
          <Button title="Close" onPress={() => setShowModal(false)} />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formSection: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#e91e63', // Pink color
    borderRadius: 3,
  },
  progressText: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 10,
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  optionsWrapper: {
    position: 'relative',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  optionButton: {
    padding: 10,
    borderRadius: 8,
    margin: 5,
    backgroundColor: '#f8bbd0', // Light pink
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#e91e63', // Dark pink
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedOptionText: {
    color: '#fff',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    backgroundColor: '#f8bbd0', // Light pink
    alignItems: 'center',
  },
  selectedRadio: {
    backgroundColor: '#e91e63', // Dark pink
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  navButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    backgroundColor: '#e91e63', // Pink color
    alignItems: 'center',
  },
  prevButton: {
    backgroundColor: '#f8bbd0', // Light pink
  },
  nextButton: {
    backgroundColor: '#e91e63', // Dark pink
  },
  submitButton: {
    backgroundColor: '#e91e63', // Dark pink
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalItem: {
    marginBottom: 15,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  modalValue: {
    fontSize: 16,
    color: '#666',
  },
});

export default PropertyListingForm;
