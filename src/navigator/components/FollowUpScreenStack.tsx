import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import FollowUpScreen from '../../screens/partner/FollowUpScreen/FollowUpScreen';
import OverdueFollowUpScreen from '../../screens/partner/FollowUpScreen/OverdueFollowUpScreen';
import UpcomingFollowUpScreen from '../../screens/partner/FollowUpScreen/UpcomingFollowUpScreen';
import SomedayFollowUpScreen from '../../screens/partner/FollowUpScreen/SomedayFollowUpScreen';
import { useTheme } from '../../context/ThemeProvider';

// Define the param list type for this stack
export type FollowUpStackParamList = {
  FollowUpScreen: undefined;
  OverdueFollowUpScreen: undefined;
  UpcomingFollowUpScreen: undefined;
  SomedayFollowUpScreen: undefined;
};

const Stack = createNativeStackNavigator<FollowUpStackParamList>();

const FollowUpScreenStack = () => {
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
      initialRouteName="FollowUpScreen"
    >
      <Stack.Screen
        name="FollowUpScreen"
        component={FollowUpScreen}
        options={{
          title: 'Follow Up',
          headerBackVisible: false, // Hide back on initial screen
        }}
      />
      <Stack.Screen
        name="OverdueFollowUpScreen"
        component={OverdueFollowUpScreen}
        options={{ title: 'Overdue Follow Up' }}
      />
      <Stack.Screen
        name="UpcomingFollowUpScreen"
        component={UpcomingFollowUpScreen}
        options={{ title: 'Upcoming Follow Up' }}
      />
      <Stack.Screen
        name="SomedayFollowUpScreen"
        component={SomedayFollowUpScreen}
        options={{ title: 'Someday Follow Up' }}
      />
    </Stack.Navigator>
  );
};

export default FollowUpScreenStack;
