
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FollowUpScreen from '../../screens/partner/FollowUpScreen/FollowUpScreen';
import OverdueFollowUpScreen from '../../screens/partner/FollowUpScreen/OverdueFollowUpScreen';
import UpcomingFollowUpScreen from '../../screens/partner/FollowUpScreen/UpcomingFollowUpScreen';
import SomedayFollowUpScreen from '../../screens/partner/FollowUpScreen/SomedayFollowUpScreen';

// Define the param list type for this stack
export type FollowUpStackParamList = {
  FollowUpScreen: undefined;
  OverdueFollowUpScreen: undefined;
  UpcomingFollowUpScreen: undefined;
  SomedayFollowUpScreen: undefined;
};

const Stack = createNativeStackNavigator<FollowUpStackParamList>();

const FollowUpScreenStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="FollowUpScreen">
      <Stack.Screen name="FollowUpScreen" component={FollowUpScreen} />
      <Stack.Screen name="OverdueFollowUpScreen" component={OverdueFollowUpScreen} />
      <Stack.Screen name="UpcomingFollowUpScreen" component={UpcomingFollowUpScreen} />
      <Stack.Screen name="SomedayFollowUpScreen" component={SomedayFollowUpScreen} />
    </Stack.Navigator>
  );
};

export default FollowUpScreenStack;
