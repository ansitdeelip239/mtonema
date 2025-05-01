import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import useForm from '../hooks/useForm';
import {MaterialTextInput} from './MaterialTextInput';
import {Button} from 'react-native-paper';
import {ProfileFormData} from '../schema/ProfileFormSchema';
import GetIcon from './GetIcon';
import Images from '../constants/Images';
import AuthService from '../services/AuthService';
import CommonService from '../services/CommonService';
import {useAuth} from '../hooks/useAuth';
import Colors from '../constants/Colors';
import {useKeyboard} from '../hooks/useKeyboard';
import {useLogoStorage} from '../hooks/useLogoStorage';

const EditProfileComponent = () => {
  const [editingFields, setEditingFields] = useState<
    Record<keyof ProfileFormData, boolean>
  >({
    name: false,
    email: false,
    location: false,
    phone: false,
  });
  const [profileUpdated, setProfileUpdated] = useState(false);
  const {user, setUser} = useAuth();
  const {keyboardVisible} = useKeyboard();
  const scrollViewRef = useRef<ScrollView>(null);
  const {logoUrl} = useLogoStorage();

  const {formInput, handleInputChange, loading, onSubmit, setFormInput} =
    useForm<ProfileFormData>({
      initialState: {
        name: '',
        email: '',
        location: '',
        phone: '',
      },
      onSubmit: async formData => {
        try {
          const requestBody = {
            id: user?.id as number,
            name: formData.name,
            email: formData.email,
            location: formData.location,
            phone: formData.phone,
          };

          const response = await CommonService.updateProfile(requestBody);
          if (response.httpStatus === 200) {
            console.log('Profile updated successfully');
            // storeUser(response.data);
            // setUser(response.data);
            setProfileUpdated(prev => !prev);
            if (user) {
              setUser({
                ...user,
                name: requestBody.name,
                email: requestBody.email,
                phone: requestBody.phone,
                location: requestBody.location,
              });
            }
          }
          setEditingFields({
            name: false,
            email: false,
            location: false,
            phone: false,
          });
        } catch (error) {
          console.error('Error submitting form:', error);
        }
      },
    });

  const toggleEdit = (field: keyof ProfileFormData) => {
    setEditingFields(prev => {
      const newEditingFields = {
        ...prev,
        [field]: !prev[field],
      };

      if (newEditingFields[field]) {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({animated: true});
        }, 300);
      }

      return newEditingFields;
    });
  };

  const isAnyFieldEditing = Object.values(editingFields).some(value => value);

  // Effect to scroll to the end when keyboard appears
  useEffect(() => {
    if (keyboardVisible && isAnyFieldEditing) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({animated: true});
      }, 300);
    }
  }, [keyboardVisible, isAnyFieldEditing]);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const token = await AuthService.getToken();
        const response = await AuthService.getUserByToken(token as string);

        setFormInput(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    }

    fetchProfileData();
  }, [setFormInput, profileUpdated]);

  // Get screen dimensions to calculate appropriate padding
  const screenHeight = Dimensions.get('window').height;

  // Determine which field is being edited to provide appropriate padding
  const getAdaptivePadding = () => {
    if (editingFields.phone) {
      return screenHeight * 0.05; // 5% for phone field
    }

    if (editingFields.location) {
      return screenHeight * 0.04; // 4% for location field
    }

    if (editingFields.email) {
      return screenHeight * 0.02; // 2% for email field
    }

    // Minimal padding for the name field at the top
    return screenHeight * 0.01; // 1% for name field
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 40}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <View style={styles.profileImageContainer}>
              {logoUrl ? (
                <Image source={{uri: logoUrl}} style={styles.profileImage} />
              ) : (
                <Image
                  source={Images.MTESTATES_LOGO}
                  style={styles.profileImage}
                />
              )}
            </View>
            <MaterialTextInput
              field="name"
              formInput={formInput}
              setFormInput={handleInputChange}
              label="Name"
              mode="outlined"
              disabled={!editingFields.name}
              rightComponent={
                <TouchableOpacity onPress={() => toggleEdit('name')}>
                  <GetIcon
                    iconName={editingFields.name ? 'clear' : 'edit'}
                    size="24"
                  />
                </TouchableOpacity>
              }
              theme={{
                colors: {
                  placeholder: !editingFields.name ? 'black' : '#666666',
                },
              }}
            />

            <MaterialTextInput
              field="email"
              formInput={formInput}
              setFormInput={handleInputChange}
              label="Email"
              mode="outlined"
              disabled={!editingFields.email}
              keyboardType="email-address"
              rightComponent={
                <TouchableOpacity onPress={() => toggleEdit('email')}>
                  <GetIcon
                    iconName={editingFields.email ? 'clear' : 'edit'}
                    size="24"
                  />
                </TouchableOpacity>
              }
            />

            <MaterialTextInput
              field="location"
              formInput={formInput}
              setFormInput={handleInputChange}
              label="Location"
              mode="outlined"
              disabled={!editingFields.location}
              rightComponent={
                <TouchableOpacity onPress={() => toggleEdit('location')}>
                  <GetIcon
                    iconName={editingFields.location ? 'clear' : 'edit'}
                    size="24"
                  />
                </TouchableOpacity>
              }
            />

            <MaterialTextInput
              field="phone"
              formInput={formInput}
              setFormInput={handleInputChange}
              label="Phone"
              mode="outlined"
              disabled={!editingFields.phone}
              keyboardType="phone-pad"
              rightComponent={
                <TouchableOpacity onPress={() => toggleEdit('phone')}>
                  <GetIcon
                    iconName={editingFields.phone ? 'clear' : 'edit'}
                    size="24"
                  />
                </TouchableOpacity>
              }
            />

            {isAnyFieldEditing && (
              <Button
                mode="contained"
                onPress={onSubmit}
                loading={loading}
                textColor={Colors.white}
                style={styles.submitButton}>
                Save Changes
              </Button>
            )}

            {/* Adaptive padding based on which field is being edited */}
            {keyboardVisible && <View style={{height: getAdaptivePadding()}} />}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    padding: 16,
    gap: 16,
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: Colors.MT_PRIMARY_1,
  },
  profileImageContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 200,
    height: 200,
    mixBlendMode: 'multiply',
    // borderRadius: 50,
  },
  bottomPadding: {
    height: 150,
  },
});

export default EditProfileComponent;
