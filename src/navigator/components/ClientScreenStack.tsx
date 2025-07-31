import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import ClientScreen from '../../screens/partner/ClientScreen/ClientScreen';
import AddClientScreen from '../../screens/partner/ClientScreen/AddClientScreen';
import ClientProfileScreen from '../../screens/partner/ClientScreen/ClientProfileScreen';
import { Client } from '../../types';
import ClientAssignmentScreen from '../../screens/partner/ClientScreen/ClientAssignmentScreen';
import MessageTemplateScreen from '../../screens/partner/ClientScreen/MessageTemplateScreen';
import MessagePreviewScreen from '../../screens/partner/ClientScreen/MessagePreviewScreen';
import { useTheme } from '../../context/ThemeProvider';

// Define the param list type for this stack
export type ClientStackParamList = {
  ClientScreen: undefined;
  AddClientScreen: { editMode: boolean; clientData?: Client };
  ClientProfileScreen: { clientId: number };
  ClientAssignmentScreen: { clientId: number; assignedUsers: { id: number; name: string; email: string }[] };
  MessageTemplateScreen: {
    clientId: number;
    clientName: string;
    clientPhone: string;
    clientWhatsapp: string;
    clientEmail: string;
    messageType: string;
  };
  MessagePreviewScreen: {
    clientId: number;
    clientName: string;
    clientPhone: string;
    clientWhatsapp: string;
    clientEmail: string;
    messageContent: string;
    templateName: string;
  };
};

const Stack = createNativeStackNavigator<ClientStackParamList>();

const ClientScreenStack = () => {
  const isIOS = Platform.OS === 'ios';
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: isIOS,
        headerBackVisible: true,
        headerBackTitle: 'Back',
        headerTintColor: '#fff',
        headerStyle: { backgroundColor: theme.primaryColor },
        headerTitleAlign: 'center',
      }}
      initialRouteName="ClientScreen"
    >
      <Stack.Screen
        name="ClientScreen"
        component={ClientScreen}
        options={{
          headerBackVisible: false, // no back button on initial screen
          title: 'Clients', // optional, set title
        }}
      />
      <Stack.Screen name="AddClientScreen" component={AddClientScreen} options={{ title: 'Add Client' }} />
      <Stack.Screen name="ClientProfileScreen" component={ClientProfileScreen} options={{ title: 'Client Profile' }} />
      <Stack.Screen name="MessagePreviewScreen" component={MessagePreviewScreen} options={{ title: 'Message Preview' }} />
      <Stack.Screen name="ClientAssignmentScreen" component={ClientAssignmentScreen} options={{ title: 'Client Assignment' }} />
      <Stack.Screen name="MessageTemplateScreen" component={MessageTemplateScreen} options={{ title: 'Message Template' }} />
    </Stack.Navigator>
  );
};

export default ClientScreenStack;
