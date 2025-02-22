import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import useForm from '../hooks/useForm';
import {MaterialTextInput} from './MaterialTextInput';
import {Button} from 'react-native-paper';
import {ProfileFormData} from '../schema/ProfileFormSchema';
import GetIcon from './GetIcon';
import Images from '../constants/Images';
import AuthService from '../services/AuthService';
import CommonService from '../services/CommonService';
import {useAuth} from '../hooks/useAuth';

const EditProfileComponent = () => {
  const [editingFields, setEditingFields] = useState<
    Record<keyof ProfileFormData, boolean>
  >({
    name: false,
    email: false,
    location: false,
    phone: false,
  });
  const {user, setUser} = useAuth();

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
          // Add your API call here
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
            setUser(response.data);
          }
          // After successful submission
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
    setEditingFields(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const isAnyFieldEditing = Object.values(editingFields).some(value => value);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const token = await AuthService.getToken();
        const response = await AuthService.getUserByToken(token as string);
        console.log('#$%#$%#$', response);

        setFormInput(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    }

    fetchProfileData();
  }, [setFormInput]);

  return (
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
        <Image source={Images.DNCR_LOGO} style={styles.profileImage} />
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
          style={styles.submitButton}>
          Save Changes
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  submitButton: {
    marginTop: 16,
  },
  profileImageContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 200,
    borderRadius: 50,
  },
});

export default EditProfileComponent;
