import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { useTheme } from '../../context/ThemeProvider';
import ListingsScreen from '../../screens/partner/ListingsScreen/ListingsScreen';
import ListingDetailScreen from '../../screens/partner/ListingsScreen/ListingDetailScreen';
import EditPartnerPropertyScreen from '../../screens/partner/ListingsScreen/EditPartnerProperty';
import { Property } from '../../screens/partner/ListingsScreen/types';

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
