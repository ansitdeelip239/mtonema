// import { View, Text } from 'react-native'
import React from 'react';
import SellerNavigator from './SellerNavigator';
import BuyerNavigator from './BuyerNavigator';
import { useAuth } from '../hooks/useAuth';
import { MasterProvider } from '../context/MasterProvider';
import { BuyerProvider } from '../context/BuyerProvider';

const MainNavigator = ()=> {
  const {user} = useAuth();

  if (user?.Role === 'User') {
    return(
<BuyerProvider>
      <BuyerNavigator/>
    </BuyerProvider>
    );
  } else if (user?.Role === 'Seller') {
    return (
      <MasterProvider>
        <SellerNavigator/>
      </MasterProvider>);
  }
};
export default MainNavigator;
