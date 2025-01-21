import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../hooks/useAuth';
import { ActivityIndicator } from 'react-native-paper';
import { api } from '../../utils/api';
import url from '../../constants/api';
import { User } from '../../types';
import CommonService from '../../services/CommonService';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FieldName = 'name' | 'email' | 'password' | 'mobile' | 'location';
type EditableFields = Record<FieldName, boolean>;

interface UserData {
  name: string;
  email: string;
  password: string;
  mobile: string;
  location: string;
  profileImage: any;
}

const INITIAL_USER_DATA: UserData = {
  name: '',
  email: '',
  password: '',
  mobile: '',
  location: '',
  profileImage: require('../../assets/Images/dncrlogo.png'),
};

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState<UserData>(INITIAL_USER_DATA);
  const [editMode, setEditMode] = useState<EditableFields>({
    name: false,
    email: false,
    password: false,
    mobile: false,
    location: false,
  });

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile: string): boolean => {
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(mobile);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const showToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    Toast.show({
      type,
      text1: type.charAt(0).toUpperCase() + type.slice(1),
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
    });
  }, []);

  // Fetch user profile
  const fetchUserProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        showToast('error', 'Authentication token not found');
        return;
      }

      const response = await CommonService.getUserByToken(token);
      if (response?.data) {
        setUserData(prevData => ({
          ...prevData,
          name: response.data.Name || '',
          email: response.data.Email || '',
          password: response.data.Password || '',
          mobile: response.data.Phone || '',
          location: response.data.Location || '',
        }));
      }
    } catch (error) {
      showToast('error', 'Failed to fetch profile data');
      console.error('Profile fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Validate all fields before update
  const validateFields = (): boolean => {
    if (!userData.name.trim()) {
      showToast('error', 'Name cannot be empty');
      return false;
    }

    if (!validateEmail(userData.email)) {
      showToast('error', 'Please enter a valid email address');
      return false;
    }

    if (editMode.password && !validatePassword(userData.password)) {
      showToast('error', 'Password must be at least 6 characters long');
      return false;
    }

    if (!validateMobile(userData.mobile)) {
      showToast('error', 'Please enter a valid 10-digit mobile number');
      return false;
    }

    if (!userData.location.trim()) {
      showToast('error', 'Location cannot be empty');
      return false;
    }

    return true;
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    try {
      if (!validateFields()) return;

      setIsLoading(true);
      const request = {
        Name: userData.name,
        Email: userData.email,
        Phone: userData.mobile,
        password: userData.password,
        Location: userData.location,
        ID: user?.ID,
        CreatedBy: null,
        CreatedOn: null,
        Role: null,
        Status: null,
        UpdatedOn: null,
      };

      const response = await api.post<User>(`${url.UpdateProfile}`, request);
      if (response.Success) {
        showToast('success', 'Profile updated successfully');
        setEditMode({
          name: false,
          email: false,
          password: false,
          mobile: false,
          location: false,
        });
        await fetchUserProfile(); // Refresh profile data
      } else {
        throw new Error(response.Message || 'Update failed');
      }
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      showToast('success', 'Logged out successfully');
    } catch (error) {
      showToast('error', 'Failed to logout');
    } finally {
      setIsLoading(false);
      setShowLogoutModal(false);
    }
  };

  // Reusable field component with validation
  const ProfileField = ({
    label,
    field,
    value,
    keyboardType = 'default',
    multiline = false,
    secureTextEntry = false,
  }: {
    label: string;
    field: FieldName;
    value: string;
    keyboardType?: 'default' | 'email-address' | 'phone-pad';
    multiline?: boolean;
    secureTextEntry?: boolean;
  }) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            editMode[field] && styles.editInput,
          ]}
          value={value}
          onChangeText={(text) => setUserData(prev => ({ ...prev, [field]: text }))}
          editable={editMode[field]}
          keyboardType={keyboardType}
          multiline={multiline}
          secureTextEntry={secureTextEntry && !showPassword}
          placeholder={`Enter ${label.toLowerCase()}`}
          autoCapitalize={field === 'email' ? 'none' : 'sentences'}
          autoCorrect={false}
        />
        {field === 'password' && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.iconButton}>
            <Image
              source={showPassword 
                ? require('../../assets/Icon/eye.png')
                : require('../../assets/Icon/eye-slash.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => setEditMode(prev => ({ ...prev, [field]: !prev[field] }))}
          style={styles.iconButton}>
          <Image
            source={require('../../assets/Icon/Edit.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#cc0e74" />
      </View>
    );
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileImageContainer}>
          <Image source={userData.profileImage} style={styles.profileImage} />
        </View>

        <ProfileField label="Name" field="name" value={userData.name} />
        <ProfileField 
          label="Email" 
          field="email" 
          value={userData.email} 
          keyboardType="email-address" 
        />
        <ProfileField 
          label="Password" 
          field="password" 
          value={userData.password} 
          secureTextEntry 
        />
        <ProfileField 
          label="Mobile" 
          field="mobile" 
          value={userData.mobile} 
          keyboardType="phone-pad" 
        />
        <ProfileField 
          label="Location" 
          field="location" 
          value={userData.location} 
          multiline 
        />

        {Object.values(editMode).some(Boolean) && (
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleUpdateProfile}
            disabled={isLoading}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={() => setShowLogoutModal(true)}
          disabled={isLoading}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to logout?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLogoutModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleLogout}
                disabled={isLoading}>
                <Text style={styles.buttonText}>Log out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Toast />
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
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
  fieldContainer: {
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  label: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 8,
    borderRadius: 4,
  },
  multilineInput: {
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  editInput: {
    backgroundColor: '#e3f2fd',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  icon: {
    width: 20,
    height: 20,
  },
  button: {
    marginTop: 16,
    padding: 15,
    backgroundColor: '#4f772d',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#cc0e74',
    marginTop: 16,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalText: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
  },
  confirmButton: {
    backgroundColor: '#cc0e74',
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ProfileScreen;
