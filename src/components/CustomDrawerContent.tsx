import React, {useState} from 'react';
import {useAuth} from '../hooks/useAuth';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {Avatar, Title, Drawer, TouchableRipple, Icon} from 'react-native-paper';
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

const CustomDrawerContent = (props: any) => {
  const {logout} = useAuth();
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
  const openURL = (url: any) => {
    Linking.openURL(url).catch(err =>
      console.error('Failed to open URL:', err),
    );
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{flex: 1}}>
      <View>
        <Text style={styles.name}>{props.username} </Text>
        <Image
          source={require('../assets/Images/propaty.png')}
          style={styles.logo}
        />
      </View>

      {/* Existing Drawer Items */}
      <DrawerItemList {...props} />
      <View style={styles.linkdesign}>
        <TouchableHighlight
          style={{
            borderRadius: 50,
            overflow: 'hidden',
          }}
          underlayColor={Colors.main}
          onPress={() => Linking.openURL(Strings.About_Us_Url)}>
          <Drawer.Item label="About" />
        </TouchableHighlight>


        <TouchableHighlight
          style={{
            borderRadius: 50,
            overflow: 'hidden',
          }}
          underlayColor={Colors.main}
          onPress={() => Linking.openURL(Strings.FAQ_Url)}>
          <Drawer.Item label="FAQ" />
        </TouchableHighlight>
      </View>

      {/* Custom Button */}
      <View style={styles.flexGrow} />
      <View style={styles.p15}>
        <TouchableOpacity
          onPress={handleCustomButtonPress}
          style={styles.logout}
          disabled={isLoggingOut}>
          <Text style={styles.textWhite}>Logout</Text>
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
  flexGrow: {
    flex: 1,
  },
  linkdesign: {},
  logout: {
    backgroundColor: '#cc0e74',
    padding: 10,
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    top: 115,
    left: 67,
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
  logo: {
    width: 100,
    height: 110,
    margin: 1,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 30,
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
    backgroundColor: '#EE0000',
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
});

export default CustomDrawerContent;
