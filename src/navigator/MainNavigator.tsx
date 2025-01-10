import { View, Text } from 'react-native'
import React from 'react'
import SellerNavigator from './SellerNavigator';
import BuyerNavigator from './BuyerNavigator';
import { useAuth } from '../hooks/useAuth';
import { MasterProvider } from '../context/MasterProvider';

const MainNavigator=()=> {
  const {user} = useAuth();

  if (user?.Role === 'User') {
    return <BuyerNavigator/>;
  } else if (user?.Role === 'Seller') {
    return (
      <MasterProvider>
        <SellerNavigator/>
      </MasterProvider>);
  }
};
export default MainNavigator;