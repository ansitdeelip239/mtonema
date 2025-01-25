import {createDrawerNavigator} from '@react-navigation/drawer';
import React, {memo} from 'react';
import Colors from '../constants/Colors';
import CustomDrawerContent from '../components/CustomDrawerContent';
import ProfileScreen from '../screens/common/ProfileScreen';
import ClientScreen from '../screens/partner/ClientScreen/ClientScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AddAgentPropertyScreen from '../screens/partner/AddAgentPropertyScreen/AddAgentPropertyScreen';
import AgentDataScreen from '../screens/partner/AgentsPropertyScreen/AgentsPropertyScreen';

export type AgentStackParamList = {
  AgentPropertyList: undefined;
  AddAgentProperty: undefined;
};

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator<AgentStackParamList>();

const AgentPropertyStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="AgentPropertyList" component={AgentDataScreen} />
      <Stack.Screen
        name="AddAgentProperty"
        component={AddAgentPropertyScreen}
      />
    </Stack.Navigator>
  );
};

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
      <Drawer.Screen name="Agent's Property" component={AgentPropertyStack} />
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
