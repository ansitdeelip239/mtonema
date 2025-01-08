import {createDrawerNavigator} from '@react-navigation/drawer';
import React,{memo} from 'react';
import Colors from '../constants/Colors';
import BuyerHomeScreen from '../screens/buyer/BuyerHomeScreen';
import ContactScreen from '../screens/buyer/ContactScreen';
import ContactedProperty from '../screens/buyer/ContactedProperty';
import CustomDrawerContent from '../components/CustomDrawerContent';
import ChangePasswordScreen from '../screens/auth/ChangePasswordScreen';
import ProfileScreen from '../screens/common/ProfileScreen';

const Drawer = createDrawerNavigator();
const BuyerNavigator = memo(() => {
  return (

    <Drawer.Navigator
      // eslint-disable-next-line react/no-unstable-nested-components
      drawerContent={props => (
        <CustomDrawerContent {...props} />
      )}
      initialRouteName="Home"
      screenOptions={{
        drawerType: 'front',
        drawerActiveTintColor: 'white',
        drawerActiveBackgroundColor: Colors.main,
        drawerStyle: {
          width: 240,
        },
        headerStyle: {
          backgroundColor: Colors.main,
        },
        headerTintColor: Colors.SECONDARY_3,
      }}>
      <Drawer.Screen name="Home" component={BuyerHomeScreen} />
      <Drawer.Screen name="Contacted Property" component={ContactedProperty} />
      <Drawer.Screen name="Change Password" component={ChangePasswordScreen} />
      <Drawer.Screen name="Contact Us" component={ContactScreen} />
      <Drawer.Screen name="ProfileScreen" component={ProfileScreen} options={{ drawerItemStyle: { display: 'none' } }} />
    </Drawer.Navigator>
  );
});

export default BuyerNavigator;
