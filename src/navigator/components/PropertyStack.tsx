import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PropertyListScreen from '../../screens/seller/PropertyListScreen';
import PropertyDetailScreen from '../../screens/seller/PropertyDetailScreen';
import {SellerProperty} from '../../types';

export type PropertyStackParamList = {
  PropertyList: undefined;
  PropertyDetail: {property: SellerProperty};
};

const Stack = createNativeStackNavigator<PropertyStackParamList>();

const PropertyStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="PropertyList" component={PropertyListScreen} />
      <Stack.Screen name="PropertyDetail" component={PropertyDetailScreen} />
    </Stack.Navigator>
  );
};

export default PropertyStack;
