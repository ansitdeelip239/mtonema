import {createDrawerNavigator} from '@react-navigation/drawer';
import React, {memo} from 'react';
import Colors from '../constants/Colors';
import ContactScreen from '../screens/buyer/ContactScreen';
import ContactedProperty from '../screens/buyer/ContactedProperty';
import CustomDrawerContent from '../components/CustomDrawerContent';
import ProfileScreen from '../screens/common/ProfileScreen';
import Home from '../screens/buyer/Home';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SearchProperty from '../screens/buyer/SearchProperty';
import RecommendedProperty from '../screens/buyer/RecommendedProperty';
import GetIcon from '../components/GetIcon';
import { StyleSheet, TouchableOpacity } from 'react-native';

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
        headerShown: true,
        drawerStyle: {
          width: 240,
        },
        headerStyle: {
          backgroundColor: Colors.main,
        },
        headerTintColor: Colors.SECONDARY_3,
      }}>
      <Drawer.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          headerShown: false,
          // eslint-disable-next-line react/no-unstable-nested-components
          drawerIcon: ({color}) => (
            <GetIcon iconName="home" color={color} size="23" /> // Use GetIcon here
          ),
        }}
      />
      <Drawer.Screen
        name="Contacted Property"
        component={ContactedProperty}
        options={{
          headerShown: false,
          // eslint-disable-next-line react/no-unstable-nested-components
          drawerIcon: ({color}) => (
            <GetIcon iconName="ContactedProperty" color={color} size="23" /> // Use GetIcon here
          ),
        }}
      />
      <Drawer.Screen
        name="Contact Us"
        component={ContactScreen}
        options={{
          headerShown: false,
          // eslint-disable-next-line react/no-unstable-nested-components
          drawerIcon: ({color}) => (
            <GetIcon iconName="contactus" color={color} size="26" /> // Use GetIcon here
          ),
        }}
      />
      <Drawer.Screen
        name="Profile Screen"
        component={ProfileScreen}
        options={({navigation}) => ({
          drawerItemStyle: {display: 'none'},
          // eslint-disable-next-line react/no-unstable-nested-components
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Home', {screen: 'Home'})
              }
              style={styles.backButton}>
              <GetIcon iconName="back" size="24" color={Colors.SECONDARY_3} />
            </TouchableOpacity>
          ),
        })}
      />
    </Drawer.Navigator>
  );
});
const styles = StyleSheet.create({
  backButton: {
    marginRight: 16,
  },
});

export default BuyerNavigator;
