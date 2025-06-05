import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ClientScreen from '../../screens/partner/ClientScreen/ClientScreen';
import AddClientScreen from '../../screens/partner/ClientScreen/AddClientScreen';
import ClientProfileScreen from '../../screens/partner/ClientScreen/ClientProfileScreen';
import {Client} from '../../types';
import ClientAssignmentScreen from '../../screens/partner/ClientScreen/ClientAssignmentScreen';
import MessageTemplateScreen from '../../screens/partner/ClientScreen/MessageTemplateScreen';
import ChooseMessageTypeScreen from '../../screens/partner/ClientScreen/ChooseMessageTypeScreen';

// Define the param list type for this stack
export type ClientStackParamList = {
  ClientScreen: undefined;
  AddClientScreen: {editMode: boolean; clientData?: Client};
  ClientProfileScreen: {clientId: number};
  ClientAssignmentScreen: {clientId: number; assignedUsers: number[]};
  ChooseMessageTypeScreen: {
    clientId: number;
    clientName: string;
    clientPhone: string;
    clientWhatsapp: string;
    clientEmail: string;
  };
  MessageTemplateScreen: {
    clientId: number;
    clientName: string;
    clientPhone: string;
    clientWhatsapp: string;
    clientEmail: string;
    messageType: string;
  };
};

const Stack = createNativeStackNavigator<ClientStackParamList>();

const ClientScreenStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="ClientScreen">
      <Stack.Screen name="ClientScreen" component={ClientScreen} />
      <Stack.Screen name="AddClientScreen" component={AddClientScreen} />
      <Stack.Screen
        name="ClientProfileScreen"
        component={ClientProfileScreen}
      />
      <Stack.Screen
        name="ChooseMessageTypeScreen"
        component={ChooseMessageTypeScreen}
      />
      <Stack.Screen
        name="ClientAssignmentScreen"
        component={ClientAssignmentScreen}
      />
      <Stack.Screen
        name="MessageTemplateScreen"
        component={MessageTemplateScreen}
      />
    </Stack.Navigator>
  );
};

export default ClientScreenStack;
