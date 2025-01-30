import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ClientScreen from '../../screens/partner/ClientScreen/ClientScreen';
import AddClientScreen from '../../screens/partner/ClientScreen/AddClientScreen';
import ClientProfileScreen from '../../screens/partner/ClientScreen/ClientProfileScreen';

// Define the param list type for this stack
export type ClientStackParamList = {
  ClientScreen: undefined;
  AddClientScreen: undefined;
  ClientProfileScreen: {clientId: number};
};

const Stack = createNativeStackNavigator<ClientStackParamList>();

const ClientScreenStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="ClientScreen">
      <Stack.Screen name="ClientScreen" component={ClientScreen} />
      <Stack.Screen name="AddClientScreen" component={AddClientScreen} />
      <Stack.Screen name="ClientProfileScreen" component={ClientProfileScreen} />
    </Stack.Navigator>
  );
};

export default ClientScreenStack;
