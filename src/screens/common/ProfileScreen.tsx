import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Modal,
} from 'react-native';
import {useAuth} from '../../hooks/useAuth';
import {ActivityIndicator} from 'react-native-paper';
import {api} from '../../utils/api';
import url from '../../constants/api';
import { User } from '../../types';
const ProfileScreen = () => {
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  // State for user data
  const {user,logout} = useAuth();
  const [users, setUser] = useState({
    name: user?.Name,
    email: user?.Email,
    password: user?.Password,
    mobile: user?.Phone,
    location: user?.Location,
    profileImage: require('../../assets/Images/dncrlogo.png'),
  });

  // State for edit mode of each field
  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
    password: false,
    mobile: false,
    location: false,
  });

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Function to handle profile update
  const handleUpdateProfile = async() => {
try {
    const request = {
        Name:users.name,
        Email:users.email,
        Phone:users.mobile,
        password:users.password,
        Location:users.location,
        ID:user?.ID,
        CreatedBy:null,
        CreatedOn:null,
        Role:null,
        Status:null,
        UpdatedOn:null,
    };
    const response = await api.post<User>(
              `${url.UpdateProfile}`,request
            );
    if(response.Success)
    {
        Alert.alert('Success', 'Profile updated successfully!');
    }
    else
    {
        throw new Error(response.Message);
    }
} catch (error) {
    if(error instanceof Error)
    {
        Alert.alert('Error', error.message);
    }
}
    setEditMode({
      name: false,
      email: false,
      password: false,
      mobile: false,
      location: false,
    }); // Exit edit mode for all fields
  };

  // Function to toggle edit mode for a specific field
  const toggleEditMode = (field: keyof typeof editMode) => {
    setEditMode({...editMode, [field]: !editMode[field]});
  };

  // Function to handle profile picture change
  // const handleChangeProfilePicture = () => {
  //   Alert.alert(
  //     'Info',
  //     'Feature to change profile picture is under development.',
  //   );
  // };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    setModalVisible(false);
    setLoadingModalVisible(true);
    await logout();
    setIsLoggingOut(false);
    setLoadingModalVisible(false);
    console.log('Logged Out Successfully');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Profile Image with Edit Icon */}
      <View style={styles.profileImageContainer}>
        <Image source={users.profileImage} style={styles.profileImage} />
        {/* <TouchableOpacity
          onPress={handleChangeProfilePicture}
          style={styles.profileEditIcon}>
          <Image
            source={require('../../assets/Icon/Edit.png')}
            style={styles.iconImage}
          />
        </TouchableOpacity> */}
      </View>

      {/* Name Field */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Name</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, editMode.name && styles.editInput]} // Change background color only for this field
            value={users.name}
            onChangeText={text => setUser({...users, name: text})}
            editable={editMode.name}
          />
          <TouchableOpacity
            onPress={() => toggleEditMode('name')}
            style={styles.editIcon}>
            <Image
              source={require('../../assets/Icon/Edit.png')}
              style={styles.iconImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Email Field */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, editMode.email && styles.editInput]} // Change background color only for this field
            value={users.email}
            onChangeText={text => setUser({...users, email: text})}
            editable={editMode.email}
            keyboardType="email-address"
          />
          <TouchableOpacity
            onPress={() => toggleEditMode('email')}
            style={styles.editIcon}>
            <Image
              source={require('../../assets/Icon/Edit.png')}
              style={styles.iconImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Password Field */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, editMode.password && styles.editInput]} // Change background color only for this field
            value={users.password}
            onChangeText={text => setUser({...users, password: text})}
            secureTextEntry={!showPassword}
            editable={editMode.password}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}>
            <Image
              source={
                showPassword
                  ? require('../../assets/Icon/eye.png')
                  : require('../../assets/Icon/eye-slash.png')
              }
              style={styles.iconImage}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => toggleEditMode('password')}
            style={styles.editIcon}>
            <Image
              source={require('../../assets/Icon/Edit.png')}
              style={styles.iconImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Mobile Field */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Mobile</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, editMode.mobile && styles.editInput]} // Change background color only for this field
            value={users.mobile}
            onChangeText={text => setUser({...users, mobile: text})}
            editable={editMode.mobile}
            keyboardType="phone-pad"
          />
          <TouchableOpacity
            onPress={() => toggleEditMode('mobile')}
            style={styles.editIcon}>
            <Image
              source={require('../../assets/Icon/Edit.png')}
              style={styles.iconImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Location Field */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Location</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              styles.locationInput,
              editMode.location && styles.editInput,
            ]}
            value={users.location}
            onChangeText={text => setUser({...users, location: text})}
            editable={editMode.location}
            multiline={true}
            numberOfLines={4}
          />
          <TouchableOpacity
            onPress={() => toggleEditMode('location')}
            style={styles.editIcon}>
            <Image
              source={require('../../assets/Icon/Edit.png')}
              style={styles.iconImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Save Profile Button (Visible if any field is in edit mode) */}
      {(editMode.name ||
        editMode.email ||
        editMode.password ||
        editMode.mobile ||
        editMode.location) && (
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleUpdateProfile}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      )}

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.whiteButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.textBlack}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.redButton}
                onPress={confirmLogout}
                disabled={isLoggingOut}>
                <Text style={styles.textWhite}>Log out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={loadingModalVisible}
        onRequestClose={() => setLoadingModalVisible(false)}>
        <View style={styles.loadingModalContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Logging out...</Text>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: 20,
  },
  locationInput: {
    maxHeight: 100, // Set a maximum height for the location input
  },
  profileImage: {
    width: 150,
    height: 200,
    borderRadius: 50,
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
  },
  redButton: {
    flex: 1,
    padding: 10,
    margin: 5,
    backgroundColor: '#cc0e74',
    borderRadius: 5,
    alignItems: 'center',
  },
  textBlack: {
    color: 'black',
  },
  textWhite: {
    color: 'white',
    fontWeight: 'bold',
  },
  whiteButton: {
    flex: 1,
    padding: 10,
    margin: 5,
    backgroundColor: '#FFF',
    borderRadius: 5,
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
  },
  modalText: {
    marginBottom: 10,
    fontSize: 18,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  profileEditIcon: {
    position: 'absolute',
    right: 4,
    bottom: 18,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
    elevation: 4, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  iconImage: {
    width: 20,
    height: 20,
    alignContent: 'center',
  },
  fieldContainer: {
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
  },
  label: {
    fontSize: 14,
    color: '#777',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    borderRadius: 5,
    borderColor: '#ccc',
  },
  editInput: {
    backgroundColor: '#e3f2fd', // Light blue background in edit mode
  },
  editIcon: {
    marginLeft: 10,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  saveButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#4f772d',
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 10,
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#cc0e74',
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
