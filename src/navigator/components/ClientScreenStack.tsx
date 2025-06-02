import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ClientScreen from '../../screens/partner/ClientScreen/ClientScreen';
import AddClientScreen from '../../screens/partner/ClientScreen/AddClientScreen';
import ClientProfileScreen from '../../screens/partner/ClientScreen/ClientProfileScreen';
import { Client } from '../../types';
import ClientAssignmentScreen from '../../screens/partner/ClientScreen/ClientAssignmentScreen';
import MessageTemplateScreen from '../../screens/partner/ClientScreen/MessageTemplateScreen';

// Define the param list type for this stack
export type ClientStackParamList = {
  ClientScreen: undefined;
  AddClientScreen: {editMode: boolean; clientData?: Client};
  ClientProfileScreen: {clientId: number};
  ClientAssignmentScreen: {clientId: number, assignedUsers: number[]};
  MessageTemplateScreen: {clientId: number, clientName: string, clientPhone: string, clientWhatsapp: string, clientEmail: string};
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
      <Stack.Screen name="ClientAssignmentScreen" component={ClientAssignmentScreen} />
      <Stack.Screen name="MessageTemplateScreen" component={MessageTemplateScreen} />
    </Stack.Navigator>
  );
};

export default ClientScreenStack;
