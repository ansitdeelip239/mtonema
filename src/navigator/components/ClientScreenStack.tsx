import React from 'react';
import { TouchableOpacity, Text, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClientScreen from '../../screens/partner/ClientScreen/ClientScreen';
import AddClientScreen from '../../screens/partner/ClientScreen/AddClientScreen';
import ClientProfileScreen from '../../screens/partner/ClientScreen/ClientProfileScreen';
import { Client } from '../../types';
import ClientAssignmentScreen from '../../screens/partner/ClientScreen/ClientAssignmentScreen';
import MessageTemplateScreen from '../../screens/partner/ClientScreen/MessageTemplateScreen';
import MessagePreviewScreen from '../../screens/partner/ClientScreen/MessagePreviewScreen';
import { useTheme } from '../../context/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { PartnerDrawerParamList } from '../../types/navigation';
import GetIcon from '../../components/GetIcon';
import { useAuth } from '../../hooks/useAuth';
import Roles from '../../constants/Roles';

// define your param list with 'FilterScreen'
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
  const drawerNavigation =
    useNavigation<DrawerNavigationProp<PartnerDrawerParamList>>();
  const { user } = useAuth();

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
        options={({ navigation }) => ({
          headerBackVisible: false, // no back button on root screen
          title: 'Clients',
          // Show drawer icon only on root screen
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => drawerNavigation.toggleDrawer()}
              style={{ marginLeft: 16, padding: 4 }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <GetIcon iconName="hamburgerMenu" color="#fff" size={18} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <>
              {(user?.role === Roles.ADMIN || user?.role === Roles.TEAM) && (
                <TouchableOpacity
                  onPress={() => drawerNavigation.navigate('Filter Partners')}
                  style={{ marginRight: 16 }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <GetIcon iconName="filterFunnel" color="#fff" size={18} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => navigation.navigate('AddClientScreen', { editMode: false })}
                style={{ marginRight: 10 }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Add Client</Text>
              </TouchableOpacity>
            </>
          ),
        })}
      />
      <Stack.Screen
        name="AddClientScreen"
        component={AddClientScreen}
        options={{
          title: 'Add Client',
          // No drawer icon here, because back button will be visible
          headerLeft: undefined,
        }}
      />
      <Stack.Screen
        name="ClientProfileScreen"
        component={ClientProfileScreen}
        options={{
          title: 'Client Profile',
          headerLeft: undefined,
        }}
      />
      <Stack.Screen
        name="MessagePreviewScreen"
        component={MessagePreviewScreen}
        options={{
          title: 'Message Preview',
          headerLeft: undefined,
        }}
      />
      <Stack.Screen
        name="ClientAssignmentScreen"
        component={ClientAssignmentScreen}
        options={{
          title: 'Client Assignment',
          headerLeft: undefined,
        }}
      />
      <Stack.Screen
        name="MessageTemplateScreen"
        component={MessageTemplateScreen}
        options={{
          title: 'Message Template',
          headerLeft: undefined,
        }}
      />
    </Stack.Navigator>
  );
};


export default ClientScreenStack;
