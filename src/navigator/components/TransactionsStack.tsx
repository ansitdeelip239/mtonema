
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { PartnerDrawerParamList } from '../../types/navigation';
import GetIcon from '../../components/GetIcon';
import TransactionsScreen from '../../screens/partner/TransactionsScreen/TransactionsScreen';

export type TransactionsStackParamList = {
  'Transactions Screen': undefined;
};

const Stack = createNativeStackNavigator<TransactionsStackParamList>();

const TransactionsStack = () => {
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
        // eslint-disable-next-line react/no-unstable-nested-components
        headerLeft: () => {
          const hamburgerButtonStyle = { marginLeft: 16, padding: 4 };
          return (
            <TouchableOpacity
              onPress={() => drawerNavigation.toggleDrawer()}
              style={hamburgerButtonStyle}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <GetIcon iconName="hamburgerMenu" color="#fff" size={18} />
            </TouchableOpacity>
          );
        },
      }}
      initialRouteName="Transactions Screen"
    >
      <Stack.Screen
        name="Transactions Screen"
        component={TransactionsScreen}
        options={{
          title: 'Plans',
          headerBackVisible: false, // hide back button on root screen
        }}
      />
    </Stack.Navigator>
  );
};

export default TransactionsStack;

