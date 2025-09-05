import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeProvider';
import AddPartnerPropertyScreen from '../../screens/partner/AddPartnerPropertyScreen/AddPartnerPropertyScreen';
import { PartnerDrawerParamList } from '../../types/navigation';
import GetIcon from '../../components/GetIcon';
import { useDrawer } from '../../hooks/useDrawer';

export type AddPropertyStackParamList = {
  AddPartnerProperty: undefined;
};

const Stack = createNativeStackNavigator<AddPropertyStackParamList>();

// Define component outside of render to avoid unstable nested components warning
const DrawerToggleButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{ marginLeft: 16, padding: 4 }}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <GetIcon iconName="hamburgerMenu" color="#fff" size={18} />
  </TouchableOpacity>
);

const AddPropertyStack = () => {
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
        // eslint-disable-next-line react/no-unstable-nested-components
        headerLeft: () => (
          <DrawerToggleButton onPress={openDrawer} />
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

