import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { useTheme } from '../../context/ThemeProvider';
import AddPartnerPropertyScreen from '../../screens/partner/AddPartnerPropertyScreen/AddPartnerPropertyScreen';

export type AddPropertyStackParamList = {
  AddPartnerProperty: undefined;
};

const Stack = createNativeStackNavigator<AddPropertyStackParamList>();

const AddPropertyStack = () => {
  const { theme } = useTheme();
  const isIOS = Platform.OS === 'ios';

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: isIOS,
        headerStyle: { backgroundColor: theme.primaryColor },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerBackVisible: true,
        headerBackTitle: 'Back',
      }}
      initialRouteName="AddPartnerProperty"
    >
      <Stack.Screen
        name="AddPartnerProperty"
        component={AddPartnerPropertyScreen}
        options={{
          title: 'Add Property',
          headerBackVisible: false, // hide back button on root screen
        }}
      />
    </Stack.Navigator>
  );
};

export default AddPropertyStack;

