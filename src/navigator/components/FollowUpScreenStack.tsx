import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, TouchableOpacity } from 'react-native';
import FollowUpScreen from '../../screens/partner/FollowUpScreen/FollowUpScreen';
import OverdueFollowUpScreen from '../../screens/partner/FollowUpScreen/OverdueFollowUpScreen';
import UpcomingFollowUpScreen from '../../screens/partner/FollowUpScreen/UpcomingFollowUpScreen';
import SomedayFollowUpScreen from '../../screens/partner/FollowUpScreen/SomedayFollowUpScreen';
import { useTheme } from '../../context/ThemeProvider';
import { PartnerDrawerParamList } from '../../types/navigation';
import GetIcon from '../../components/GetIcon';
import { useDrawer } from '../../hooks/useDrawer';

// Define the param list type for this stack
export type FollowUpStackParamList = {
  FollowUpScreen: undefined;
  OverdueFollowUpScreen: undefined;
  UpcomingFollowUpScreen: undefined;
  SomedayFollowUpScreen: undefined;
};

const Stack = createNativeStackNavigator<FollowUpStackParamList>();

// Define the drawer toggle button component outside of render
const DrawerToggleButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{ marginLeft: 16, padding: 4 }}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <GetIcon iconName="hamburgerMenu" color="#fff" size={18} />
  </TouchableOpacity>
);

const FollowUpScreenStack = () => {
  const { theme } = useTheme();
  const isIOS = Platform.OS === 'ios';

  const { openDrawer } = useDrawer<PartnerDrawerParamList>();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: isIOS,
        headerStyle: { backgroundColor: theme.primaryColor },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerBackVisible: true,
        headerBackTitle: 'Back',
        // NO headerLeft here — we will add it per-screen
      }}
      initialRouteName="FollowUpScreen"
    >
      <Stack.Screen
        name="FollowUpScreen"
        component={FollowUpScreen}
        options={{
          title: 'Follow Up',
          headerBackVisible: false, // Hide back button on initial screen

          // Show drawer icon only on the root screen
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => (
            <DrawerToggleButton onPress={openDrawer} />
          ),
        }}
      />
      <Stack.Screen
        name="OverdueFollowUpScreen"
        component={OverdueFollowUpScreen}
        options={{ title: 'Overdue Follow Up' /* no headerLeft here */ }}
      />
      <Stack.Screen
        name="UpcomingFollowUpScreen"
        component={UpcomingFollowUpScreen}
        options={{ title: 'Upcoming Follow Up' /* no headerLeft here */ }}
      />
      <Stack.Screen
        name="SomedayFollowUpScreen"
        component={SomedayFollowUpScreen}
        options={{ title: 'Someday Follow Up' /* no headerLeft here */ }}
      />
    </Stack.Navigator>
  );
};

export default FollowUpScreenStack;

