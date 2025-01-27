import React, {memo} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AgentDataScreen from '../screens/partner/AgentsPropertyScreen/AgentsPropertyScreen';
import AddAgentPropertyScreen from '../screens/partner/AddAgentPropertyScreen/AddAgentPropertyScreen';
import {AgentStackParamList} from '../types/navigation';

const Stack = createNativeStackNavigator<AgentStackParamList>();

const AgentPropertyStack = memo(() => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="AgentPropertyList" component={AgentDataScreen} />
    <Stack.Screen name="AddAgentProperty" component={AddAgentPropertyScreen} />
  </Stack.Navigator>
));

export default AgentPropertyStack;
