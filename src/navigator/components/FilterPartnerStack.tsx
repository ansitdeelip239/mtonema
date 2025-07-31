import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { useTheme } from '../../context/ThemeProvider';
import FilterPartnerScreen from '../../screens/partner/FilterPartnerScreen/FilterPartnerScreen';

export type FilterPartnerStackParamList = {
  FilterPartnerScreen: undefined;
};

const Stack = createNativeStackNavigator<FilterPartnerStackParamList>();

const FilterPartnerStack = () => {
  const { theme } = useTheme();
  const isIOS = Platform.OS === 'ios';

  return (
    <Stack.Navigator
      initialRouteName="FilterPartnerScreen"
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
        name="FilterPartnerScreen"
        component={FilterPartnerScreen}
        options={{
          title: 'Filter Partners',
          headerBackVisible: false, // no back button on initial screen
        }}
      />
    </Stack.Navigator>
  );
};

export default FilterPartnerStack;
