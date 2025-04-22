import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FeedbackScreen from '../../screens/partner/FeedbackScreen/FeedbackScreen';

// Define the param list type for this stack
export type FeedbackStackParamList = {
  FeedbackScreen: undefined;
};

const Stack = createNativeStackNavigator<FeedbackStackParamList>();

const FeedbackScreenStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="FeedbackScreen">
      <Stack.Screen name="FeedbackScreen" component={FeedbackScreen} />
    </Stack.Navigator>
  );
};

export default FeedbackScreenStack;
