import {createDrawerNavigator} from '@react-navigation/drawer';
import React, {memo} from 'react';
import Colors from '../constants/Colors';
import CustomDrawerContent from '../components/CustomDrawerContent';
import ProfileScreen from '../screens/common/ProfileScreen';
import ClientScreen from '../screens/partner/ClientScreen/ClientScreen';
import AgentDataScreen from '../screens/partner/AgentsPropertyScreen/AgentsPropertyScreen';

const Drawer = createDrawerNavigator();

const PartnerNavigator = memo(() => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      initialRouteName="Agent's Property"
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
      <Drawer.Screen name="Agent's Property" component={AgentDataScreen} />
      <Drawer.Screen name="Client" component={ClientScreen} />
      <Drawer.Screen
        name="Profile Screen"
        component={ProfileScreen}
        options={{drawerItemStyle: {display: 'none'}}}
      />
    </Drawer.Navigator>
  );
});

export default PartnerNavigator;
