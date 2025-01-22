import {createDrawerNavigator} from '@react-navigation/drawer';
import React, {memo} from 'react';
import Colors from '../constants/Colors';
import ContactScreen from '../screens/buyer/ContactScreen';
import ContactedProperty from '../screens/buyer/ContactedProperty';
import CustomDrawerContent from '../components/CustomDrawerContent';
import ChangePasswordScreen from '../screens/auth/ChangePasswordScreen';
import ProfileScreen from '../screens/common/ProfileScreen';
import Home from '../screens/buyer/Home';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SearchProperty from '../screens/buyer/SearchProperty';
import RecommendedProperty from '../screens/buyer/RecommendedProperty';
import SignupForm from '../screens/common/SignupForm';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown:false,
    }} initialRouteName="Menu">
      <Stack.Screen name="Menu" component={Home} />
      <Stack.Screen name="SearchProperty" component={SearchProperty} />
      <Stack.Screen name="RecomendedProperty" component={RecommendedProperty} />
    </Stack.Navigator>
  );
};
const BuyerNavigator = memo(() => {
  return (
    <Drawer.Navigator
      // eslint-disable-next-line react/no-unstable-nested-components
      drawerContent={props => <CustomDrawerContent {...props} />}
      initialRouteName="Home"
      screenOptions={{
        drawerType: 'front',
        drawerActiveTintColor: 'white',
        drawerActiveBackgroundColor: Colors.main,
        headerShown: false,
        drawerStyle: {
          width: 240,
        },
        headerStyle: {
          backgroundColor: Colors.main,
        },
        headerTintColor: Colors.SECONDARY_3,
      }}>
      <Drawer.Screen name="Home" component={HomeStackNavigator} />
      <Drawer.Screen name="Contacted Property" component={ContactedProperty} />
      <Drawer.Screen name="Change Password" component={ChangePasswordScreen} />
      <Drawer.Screen name="Contact Us" component={ContactScreen} />
      <Drawer.Screen name="form testing" component={SignupForm} />
      <Drawer.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{drawerItemStyle: {display: 'none'}}}
      />
    </Drawer.Navigator>
  );
});

export default BuyerNavigator;
