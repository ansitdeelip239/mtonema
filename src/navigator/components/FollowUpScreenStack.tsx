import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, TouchableOpacity } from 'react-native';
import FollowUpScreen from '../../screens/partner/FollowUpScreen/FollowUpScreen';
import OverdueFollowUpScreen from '../../screens/partner/FollowUpScreen/OverdueFollowUpScreen';
import UpcomingFollowUpScreen from '../../screens/partner/FollowUpScreen/UpcomingFollowUpScreen';
import SomedayFollowUpScreen from '../../screens/partner/FollowUpScreen/SomedayFollowUpScreen';
import { useTheme } from '../../context/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { PartnerDrawerParamList } from '../../types/navigation';
import GetIcon from '../../components/GetIcon';

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

  const drawerNavigation =
    useNavigation<DrawerNavigationProp<PartnerDrawerParamList>>();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: isIOS,
        headerStyle: { backgroundColor: theme.primaryColor },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerBackVisible: true,
        headerBackTitle: 'Back',
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => drawerNavigation.toggleDrawer()}
            style={{ marginLeft: 16, padding: 4 }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <GetIcon iconName="hamburgerMenu" color="#fff" size={18} />
          </TouchableOpacity>
        ),
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
