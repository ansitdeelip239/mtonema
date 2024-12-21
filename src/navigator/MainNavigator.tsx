import { View, Text } from 'react-native'
import React from 'react'
import SellerNavigator from './SellerNavigator';
import BuyerNavigator from './BuyerNavigator';
import { useAuth } from '../hooks/useAuth';

const MainNavigator=()=> {
  const {user} = useAuth();

  if (user?.Role === 'User') {
    return <BuyerNavigator />;
  } else if (user?.Role === 'Seller') {
    return <SellerNavigator />;
  }
};
export default MainNavigator;