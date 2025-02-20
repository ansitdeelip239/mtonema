import React, {useEffect, useState, useCallback, useRef} from 'react';
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
import {useAuth} from '../../hooks/useAuth';
import {ActivityIndicator} from 'react-native-paper';
import {api} from '../../utils/api';
import url from '../../constants/api';
import {User} from '../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GetIcon from '../../components/GetIcon';
import Colors from '../../constants/Colors';
import AuthService from '../../services/AuthService';

type FieldName = 'name' | 'email' | 'mobile' | 'location';
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

interface ProfileFieldProps {
  label: string;
  field: FieldName;
  value: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  multiline?: boolean;
  secureTextEntry?: boolean;
  inputRef: React.RefObject<TextInput>;
  editMode: EditableFields;
  setEditMode: React.Dispatch<React.SetStateAction<EditableFields>>;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  showPassword?: boolean;
  setShowPassword?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileField = React.memo(
  ({
    label,
    field,
    value,
    keyboardType = 'default',
    multiline = false,
    secureTextEntry = false,
    inputRef,
    editMode,
    setEditMode,
    setUserData,
    showPassword,
  }: ProfileFieldProps) => {
    const handleEditPress = () => {
      setEditMode(prev => {
        const newEditMode = {...prev};
        // First, disable all other fields
        Object.keys(newEditMode).forEach(key => {
          newEditMode[key as FieldName] = false;
        });
        // Then enable the current field
        newEditMode[field] = true;
        return newEditMode;
      });

      // Use setTimeout to ensure the field becomes editable before focusing
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    };

    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={[
              styles.input,
              multiline && styles.multilineInput,
              editMode[field] && styles.editInput,
            ]}
            value={value}
            onChangeText={text =>
              setUserData(prev => ({...prev, [field]: text}))
            }
            editable={editMode[field]}
            keyboardType={keyboardType}
            multiline={multiline}
            secureTextEntry={secureTextEntry && !showPassword}
            placeholder={`Enter ${label.toLowerCase()}`}
            autoCapitalize={field === 'email' ? 'none' : 'sentences'}
            autoCorrect={false}
          />
          <TouchableOpacity onPress={handleEditPress} style={styles.iconButton}>
            <Image
              source={require('../../assets/Icon/Edit.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);

const ProfileScreen = () => {
  const {user, logout} = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userData, setUserData] = useState<UserData>(INITIAL_USER_DATA);
  const [editMode, setEditMode] = useState<EditableFields>({
    name: false,
    email: false,
    mobile: false,
    location: false,
  });

  // Refs for TextInput fields
  const nameInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const mobileInputRef = useRef<TextInput>(null);
  const locationInputRef = useRef<TextInput>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile: string): boolean => {
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(mobile);
  };

  const showToast = useCallback(
    (type: 'success' | 'error' | 'info', message: string) => {
      Toast.show({
        type,
        text1: type.charAt(0).toUpperCase() + type.slice(1),
        text2: message,
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
      });
    },
    [],
  );

  const fetchUserProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        showToast('error', 'Authentication token not found');
        return;
      }

      const response = await AuthService.getUserByToken(token);
      if (response?.data) {
        setUserData(prevData => ({
          ...prevData,
          name: response.data.name || '',
          email: response.data.email || '',
          mobile: response.data.phone || '',
          location: response.data.location || '',
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

  const validateFields = (): boolean => {
    if (!userData.name.trim()) {
      showToast('error', 'Name cannot be empty');
      return false;
    }

    if (!validateEmail(userData.email)) {
      showToast('error', 'Please enter a valid email address');
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

  const handleUpdateProfile = async () => {
    try {
      if (!validateFields()) {
        return;
      }

      setIsLoading(true);
      const request = {
        Name: userData.name,
        Email: userData.email,
        Phone: userData.mobile,
        password: userData.password,
        Location: userData.location,
        ID: user?.id,
        CreatedBy: null,
        CreatedOn: null,
        Role: null,
        Status: null,
        UpdatedOn: null,
      };

      const response = await api.post<User>(`${url.UpdateProfile}`, request);
      if (response.success) {
        showToast('success', 'Profile updated successfully');
        setEditMode({
          name: false,
          email: false,
          mobile: false,
          location: false,
        });
        await fetchUserProfile();
      } else {
        throw new Error(response.message || 'Update failed');
      }
    } catch (error) {
      showToast(
        'error',
        error instanceof Error ? error.message : 'Failed to update profile',
      );
    } finally {
      setIsLoading(false);
    }
  };

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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#cc0e74" />
      </View>
    );
  }

  return (
    <>
      {/* <Header title="User Profile" /> */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileImageContainer}>
          <Image source={userData.profileImage} style={styles.profileImage} />
        </View>

        <ProfileField
          label="Name"
          field="name"
          value={userData.name}
          inputRef={nameInputRef}
          editMode={editMode}
          setEditMode={setEditMode}
          setUserData={setUserData}
        />
        <ProfileField
          label="Email"
          field="email"
          value={userData.email}
          keyboardType="email-address"
          inputRef={emailInputRef}
          editMode={editMode}
          setEditMode={setEditMode}
          setUserData={setUserData}
        />
        <ProfileField
          label="Mobile"
          field="mobile"
          value={userData.mobile}
          keyboardType="phone-pad"
          inputRef={mobileInputRef}
          editMode={editMode}
          setEditMode={setEditMode}
          setUserData={setUserData}
        />
        <ProfileField
          label="Location"
          field="location"
          value={userData.location}
          multiline
          inputRef={locationInputRef}
          editMode={editMode}
          setEditMode={setEditMode}
          setUserData={setUserData}
        />

        {Object.values(editMode).some(Boolean) && (
          <TouchableOpacity
            style={styles.savebutton}
            onPress={handleUpdateProfile}
            disabled={isLoading}>
            <Text style={styles.savebuttonText}>Save Changes</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={() => setShowLogoutModal(true)}
          disabled={isLoading}>
          <GetIcon iconName="logout" color="white" size="20" />
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
            <Text style={styles.modalText}>
              Are you sure you want to logout?
            </Text>
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
    shadowOffset: {width: 0, height: 1},
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
    padding: 12,
    backgroundColor: '#fff',
    color: 'black',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  savebuttonText: {
    color: Colors.main,
    fontSize: 16,
    fontWeight: 'bold',
  },
  savebutton: {
    marginTop: 16,
    padding: 15,
    backgroundColor: '#fff',
    color: 'black',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    // shadowColor: Colors.main,
    shadowColor: Colors.black,
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logoutButton: {
    backgroundColor: '#cc0e74',
    marginTop: 16,
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    minHeight: 40,
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
    shadowOffset: {width: 0, height: 2},
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
