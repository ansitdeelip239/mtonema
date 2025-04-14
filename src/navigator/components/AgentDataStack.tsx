import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AddAgentPropertyScreen from '../../screens/partner/AgentsPropertyScreen/AddAgentPropertyScreen';
import AgentDataScreen from '../../screens/partner/AgentsPropertyScreen/AgentsPropertyScreen';
import {AgentData} from '../../types';

// Define the param list type for this stack
export type AgentDataStackParamList = {
  AgentDataScreen: undefined;
  AddAgentDataScreen: {editMode: boolean; propertyData: AgentData};
};

const Stack = createNativeStackNavigator<AgentDataStackParamList>();

const AgentDataScreenStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="AgentDataScreen">
      <Stack.Screen name="AgentDataScreen" component={AgentDataScreen} />
      <Stack.Screen
        name="AddAgentDataScreen"
        component={AddAgentPropertyScreen}
      />
    </Stack.Navigator>
  );
};

export default AgentDataScreenStack;
