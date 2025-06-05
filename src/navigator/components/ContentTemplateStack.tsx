import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ContentScreen from '../../screens/partner/ContentScreen/ContentScreen';
import AddContentScreen from '../../screens/partner/ContentScreen/AddContentScreen';
import { ContentTemplate } from '../../types';

// Define the param list type for this stack
export type ContentTemplateStackParamList = {
  ContentTemplateScreen: undefined;
  AddContentTempleteScreen: {
    editMode?: boolean;
    templateData?: ContentTemplate;
  };
};

const Stack = createNativeStackNavigator<ContentTemplateStackParamList>();

const ContentTemplateScreenStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="ContentTemplateScreen">
      <Stack.Screen name="ContentTemplateScreen" component={ContentScreen} />
      <Stack.Screen
        name="AddContentTempleteScreen"
        component={AddContentScreen}
      />
    </Stack.Navigator>
  );
};

export default ContentTemplateScreenStack;
