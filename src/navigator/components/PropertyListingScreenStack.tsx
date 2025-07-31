import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeProvider';
import ListingsScreen from '../../screens/partner/ListingsScreen/ListingsScreen';
import ListingDetailScreen from '../../screens/partner/ListingsScreen/ListingDetailScreen';
import EditPartnerPropertyScreen from '../../screens/partner/ListingsScreen/EditPartnerProperty';
import { Property } from '../../screens/partner/ListingsScreen/types';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { PartnerDrawerParamList } from '../../types/navigation';
import GetIcon from '../../components/GetIcon';

// Define the param list type for this stack
export type ListingScreenStackParamList = {
  ListingsScreen: undefined;
  ListingsDetailScreen: { propertyId: number };
  EditPartnerProperty: { propertyData: Property | undefined };
};

const Stack = createNativeStackNavigator<ListingScreenStackParamList>();

const ListingScreenStack = () => {
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
      initialRouteName="ListingsScreen"
    >
      <Stack.Screen
        name="ListingsScreen"
        component={ListingsScreen}
        options={{
          headerBackVisible: false, // hide back button on initial screen
          title: 'Listings', // Optional: set a friendly title
        }}
      />
      <Stack.Screen
        name="ListingsDetailScreen"
        component={ListingDetailScreen}
        options={{
          title: 'Listing Details',
        }}
      />
      <Stack.Screen
        name="EditPartnerProperty"
        component={EditPartnerPropertyScreen}
        options={{
          title: 'Edit Property',
        }}
      />
    </Stack.Navigator>
  );
};

export default ListingScreenStack;
