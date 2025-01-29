import {createDrawerNavigator} from '@react-navigation/drawer';
import React, {memo} from 'react';
import Colors from '../constants/Colors';
import ContactScreen from '../screens/buyer/ContactScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';
import ChangePasswordScreen from '../screens/auth/ChangePasswordScreen';
import ProfileScreen from '../screens/common/ProfileScreen';
import SellerbottomTabs from './components/SellerBottomTabs';
import GetIcon from '../components/GetIcon';
const Drawer = createDrawerNavigator();

const SellerNavigator = memo(() => {
  return (
    <Drawer.Navigator
      // eslint-disable-next-line react/no-unstable-nested-components
      drawerContent={props => <CustomDrawerContent {...props} />}
      initialRouteName="Home."
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
      <Drawer.Screen
        name="Home."
        component={SellerbottomTabs}
        options={{
          headerShown: false,
          // eslint-disable-next-line react/no-unstable-nested-components
          drawerIcon: ({color}) => (
            <GetIcon iconName="home" color={color} size="23"/> // Use GetIcon here
          ),
        }}
      />
      {/* <Drawer.Screen name="Listed Property" component={PropertyListScreen} /> */}
      {/* <Drawer.Screen name="Post Property" component={PostProperty} /> */}
      <Drawer.Screen
        name="Change Password"
        component={ChangePasswordScreen}
        options={{
          // eslint-disable-next-line react/no-unstable-nested-components
          drawerIcon: ({color}) => (
            <GetIcon iconName="changepassword" color={color} size="29" /> // Use GetIcon here
          ),
        }}
      />
      <Drawer.Screen
        name="Contact Us"
        component={ContactScreen}
        options={{
          // eslint-disable-next-line react/no-unstable-nested-components
          drawerIcon: ({color}) => (
            <GetIcon iconName="contactus" color={color} size="26" /> // Use GetIcon here
          ),
        }}
      />
      <Drawer.Screen
        name="Profile Screen"
        component={ProfileScreen}
        options={{drawerItemStyle: {display: 'none'}}}
      />
    </Drawer.Navigator>
  );
});

export default SellerNavigator;
