import React from 'react';
import FormScreen1 from './FormScreen1';
import FormScreen2 from './FormScreen2';
import FormScreen3 from './FormScreen3';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

export type PostPropertyFormParamList = {
  FormScreen1: undefined;
  FormScreen2: undefined;
  FormScreen3: undefined;
};

const Stack = createNativeStackNavigator<PostPropertyFormParamList>();

const PostPropertyForm = () => {
  return (
    <Stack.Navigator
      initialRouteName="FormScreen1"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="FormScreen1" component={FormScreen1} />
      <Stack.Screen name="FormScreen2" component={FormScreen2} />
      <Stack.Screen name="FormScreen3" component={FormScreen3} />
    </Stack.Navigator>
  );
};
export default PostPropertyForm;
