import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ListingsScreen from '../../screens/partner/ListingsScreen/ListingsScreen';
import ListingDetailScreen from '../../screens/partner/ListingsScreen/ListingDetailScreen';
import EditPartnerPropertyScreen from '../../screens/partner/ListingsScreen/EditPartnerProperty';
import {Property} from '../../screens/partner/ListingsScreen/types';

// Define the param list type for this stack
export type ListingScreenStackParamList = {
  ListingsScreen: undefined;
  ListingsDetailScreen: {propertyId: number};
  EditPartnerProperty: {propertyData: Property | undefined};
};

const Stack = createNativeStackNavigator<ListingScreenStackParamList>();

const ListingScreenStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="ListingsScreen">
      <Stack.Screen name="ListingsScreen" component={ListingsScreen} />
      <Stack.Screen
        name="ListingsDetailScreen"
        component={ListingDetailScreen}
      />
      <Stack.Screen
        name="EditPartnerProperty"
        component={EditPartnerPropertyScreen}
      />
    </Stack.Navigator>
  );
};

export default ListingScreenStack;
