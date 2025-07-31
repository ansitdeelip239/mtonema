import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { useTheme } from '../../context/ThemeProvider';
import AddAgentPropertyScreen from '../../screens/partner/AgentsPropertyScreen/AddAgentPropertyScreen';
import AgentDataScreen from '../../screens/partner/AgentsPropertyScreen/AgentsPropertyScreen';
import { AgentData } from '../../types';

// Define the param list type for this stack
export type AgentDataStackParamList = {
  AgentDataScreen: undefined;
  AddAgentDataScreen: { editMode: boolean; propertyData: AgentData };
};

const Stack = createNativeStackNavigator<AgentDataStackParamList>();

const AgentDataScreenStack = () => {
  const { theme } = useTheme();
  const isIOS = Platform.OS === 'ios';

  return (
    <Stack.Navigator
      initialRouteName="AgentDataScreen"
      screenOptions={{
        headerShown: isIOS,
        headerStyle: { backgroundColor: theme.primaryColor },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerBackVisible: true,
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen
        name="AgentDataScreen"
        component={AgentDataScreen}
        options={{
          headerBackVisible: false, // hide back button on the root screen
          title: 'Agent Data',
        }}
      />
      <Stack.Screen
        name="AddAgentDataScreen"
        component={AddAgentPropertyScreen}
        options={{
          title: 'Add Agent Property',
        }}
      />
    </Stack.Navigator>
  );
};

export default AgentDataScreenStack;
