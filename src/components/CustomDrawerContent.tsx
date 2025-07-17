import React, {useState, useEffect} from 'react';
import {useAuth} from '../hooks/useAuth';
// import {useLogoStorage} from '../hooks/useLogoStorage';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../constants/Colors';
import GetIcon from './GetIcon';
import Images from '../constants/Images';
import {useTheme} from '../context/ThemeProvider';

const CustomDrawerContent = (props: any) => {
  const {user, logout} = useAuth();
  const {theme} = useTheme();
  const [userName, setUserName] = useState(user?.name || '');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // Under development modal
  const [logoutModalVisible, setLogoutModalVisible] = useState(false); // Logout confirmation modal
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);

  // const {logoUrl} = useLogoStorage();

  useEffect(() => {
    if (user?.name) {
      setUserName(user.name);
    }
  }, [user?.name]);

  const handleCustomButtonPress = () => {
    props.navigation.closeDrawer();
    setLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    setLogoutModalVisible(false);
    setLoadingModalVisible(true);
    await logout();
    setIsLoggingOut(false);
    setLoadingModalVisible(false);
    console.log('Logged Out Successfully');
  };

  const navigateToProfile = () => {
    props.navigation.navigate('Profile Screen');
    props.navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.flexOne}>
      <TouchableOpacity onPress={navigateToProfile}>
        <View style={styles.profileContainer}>
          {/* {logoUrl ? (
            <Image source={{uri: logoUrl}} style={styles.logo} />
          ) : ( */}
          <Image source={Images.MTESTATES_LOGO} style={styles.logo} />
          {/* )} */}

          <View style={styles.nameContainer}>
            <Text style={styles.name}>{userName}</Text>
            <TouchableOpacity
              style={styles.editIconContainer}
              onPress={navigateToProfile}>
              <GetIcon iconName="edit" color={theme.primaryColor} size="20" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      {/* Existing Drawer Items */}
      <DrawerItemList {...props} />

      {/* Custom About and FAQ Items */}
      <View style={styles.customItemsContainer}>
        <TouchableOpacity
          style={styles.customDrawerItem}
          onPress={() => setModalVisible(true)}>
          <View style={styles.iconContainer}>
            <GetIcon iconName="about" color="#444" size="25" />
          </View>
          <Text style={styles.itemText}>Help Center</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.customDrawerItem}
          onPress={() => setModalVisible(true)}>
          <View style={styles.iconContainer}>
            <GetIcon iconName="faq" color="#444" size="25" />
          </View>
          <Text style={styles.itemText}>Chat With Us</Text>
        </TouchableOpacity>
      </View>
      {/* Under Development Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              This feature is under development.
            </Text>
            <TouchableOpacity
              style={[styles.modalSingleButton, {backgroundColor: theme.primaryColor}]}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.textWhite}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Custom Button */}
      <View style={styles.flexGrow} />
      <View style={styles.p15}>
        <TouchableOpacity
          onPress={handleCustomButtonPress}
          style={[styles.logout, {backgroundColor: theme.primaryColor}]}
          disabled={isLoggingOut}>
          <View style={styles.drawerItem}>
            <GetIcon iconName="logout" color={Colors.white} size="25" />
            <Text style={styles.logouttxt}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Logout Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.whiteButton}
                onPress={() => setLogoutModalVisible(false)}>
                <Text style={styles.textBlack}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.redButton,
                  {backgroundColor: theme.primaryColor},
                ]}
                onPress={confirmLogout}
                disabled={isLoggingOut}>
                <Text style={styles.textWhite}>Log out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Modal */}
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
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  customItemsContainer: {
    marginTop: 8,
  },
  customDrawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 2,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 32,
    marginLeft: 4,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'black',
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  editIconContainer: {
    marginLeft: 10,
    padding: 5,
  },
  logouttxt: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 1,
    textAlign: 'center',
  },
  logo: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  flexGrow: {
    flex: 1,
  },
  logout: {
    padding: 8,
    paddingVertical: 2,
    marginLeft: 20,
    borderRadius: 50,
    width: '70%',
    alignItems: 'center',
  },
  textWhite: {
    color: 'white',
    fontWeight: 'bold',
  },
  textBlack: {
    color: 'black',
  },
  p15: {
    padding: 16,
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
  modalText: {
    marginBottom: 10,
    fontSize: 18,
    textAlign: 'center',
  },
  loadingModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  redButton: {
    flex: 1,
    padding: 10,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalSingleButton: {
    minWidth: 100,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
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
  touchableHighlight: {
    borderRadius: 50,
    overflow: 'hidden',
    marginLeft: -10,
    width: '100%',
  },
});
export default CustomDrawerContent;
