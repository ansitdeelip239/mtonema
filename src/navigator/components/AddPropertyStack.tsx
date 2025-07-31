import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeProvider';
import AddPartnerPropertyScreen from '../../screens/partner/AddPartnerPropertyScreen/AddPartnerPropertyScreen';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { PartnerDrawerParamList } from '../../types/navigation';
import GetIcon from '../../components/GetIcon';

export type AddPropertyStackParamList = {
  AddPartnerProperty: undefined;
};

const Stack = createNativeStackNavigator<AddPropertyStackParamList>();

const AddPropertyStack = () => {
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

