import React, {useState} from 'react';
import {useAuth} from '../hooks/useAuth';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
// import { Drawer} from 'react-native-paper';
import {
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import Strings from '../constants/Strings';
import Colors from '../constants/Colors';
import GetIcon from './GetIcon';
import {Drawer} from 'react-native-paper';

const CustomDrawerContent = (props: any) => {
  const {user, logout} = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);

  const handleCustomButtonPress = () => {
    props.navigation.closeDrawer();
    setModalVisible(true);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    setModalVisible(false);
    setLoadingModalVisible(true);
    await logout();
    setIsLoggingOut(false);
    setLoadingModalVisible(false);
    console.log('Logged Out Successfully');
  };
  // const openURL = (url: any) => {
  //   Linking.openURL(url).catch(err =>
  //     console.error('Failed to open URL:', err),
  //   );
  // };
  const navigateToProfile = () => {
    props.navigation.navigate('Profile Screen');
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.flexOne}>
      <TouchableOpacity onPress={navigateToProfile}>
        <View style={styles.profileContainer}>
          <Image
            source={require('../assets/Images/dncrlogo.png')}
            style={styles.logo}
          />
          <Text style={styles.name}>{user?.Name}</Text>
        </View>
      </TouchableOpacity>

      {/* Existing Drawer Items */}
      <DrawerItemList {...props} />
      <View style={styles.linkdesign}>
        <TouchableHighlight
          style={styles.touchableHighlight}
          underlayColor={Colors.main}
          onPress={() => Linking.openURL(Strings.About_Us_Url)}>
          <Drawer.Item
            label="About"
            // eslint-disable-next-line react/no-unstable-nested-components
            icon={({color}) => (
              <GetIcon iconName="about" color={color} size="25" />
            )}
            onPress={() => Linking.openURL(Strings.About_Us_Url)}
          />
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.touchableHighlight}
          underlayColor={Colors.main}
          onPress={() => Linking.openURL(Strings.FAQ_Url)}>
          <Drawer.Item
            label="FAQ"
            // eslint-disable-next-line react/no-unstable-nested-components
            icon={({color}) => (
              <GetIcon iconName="faq" color={color} size="25" />
            )}
            onPress={() => Linking.openURL(Strings.About_Us_Url)}
          />
        </TouchableHighlight>
      </View>

      {/* Custom Button */}
      <View style={styles.flexGrow} />
      <View style={styles.p15}>
        <TouchableOpacity
          onPress={handleCustomButtonPress}
          style={styles.logout}
          disabled={isLoggingOut}>
          <View style={styles.drawerItem}>
            <GetIcon iconName="logout" color={Colors.white} size="25" />
            <Text style={styles.logouttxt}>Logout</Text>
          </View>
          {/* <Text style={styles.textWhite}>Logout</Text> */}
        </TouchableOpacity>
      </View>

      {/* Logout Confirmation Modal */}
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
  drawerItemText: {
    marginLeft: 16,
    fontSize: 16,
    color: Colors.main,
  },
  profileContainer: {
    alignItems: 'center', // Center align items horizontally
    justifyContent: 'center', // Center align items vertically
  },
  logouttxt: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 1, // Space between image and text
    textAlign: 'center', // Center align text
    marginBottom: 50, // Space between image and text
  },
  logo: {
    width: '90%',
    height: 150,
    resizeMode: 'contain', // Ensure the image scales properly
    alignSelf: 'center', // Center align image
  },
  flexGrow: {
    flex: 1,
  },
  linkdesign: {},
  logout: {
    backgroundColor: '#cc0e74',
    padding: 8,
    paddingVertical: 2,
    marginLeft: 20,
    borderRadius: 50,
    width:'70%',
    alignItems: 'center',
  },
  // name: {
  //   fontSize: 16,
  //   top: 155,
  //   left: '38%',
  //   fontWeight: 'bold',
  // },

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
  // logo: {
  //   width: '80%',
  //   height: 120,
  //   margin: 1,
  //   // resizeMode: 'contain',
  //   alignSelf: 'center',
  //   marginBottom: 70,
  // },

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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background
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
    backgroundColor: '#cc0e74',
    borderRadius: 5,
    alignItems: 'center',
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
