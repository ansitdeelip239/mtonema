// import { View, Text } from 'react-native'
import React from 'react';
import SellerNavigator from './SellerNavigator';
import BuyerNavigator from './BuyerNavigator';
import {useAuth} from '../hooks/useAuth';
import {BuyerProvider} from '../context/BuyerProvider';
import {MasterProvider} from '../context/MasterProvider';

const MainNavigator = () => {
  const {user} = useAuth();

  // if (user?.Role === 'User') {
  //   return (
  //     <BuyerProvider>
  //       <BuyerNavigator />
  //     </BuyerProvider>
  //   );
  // } else if (user?.Role === 'Seller') {
  //   return <SellerNavigator />;
  // }
  return (
    <MasterProvider>
      {user?.Role === 'User' ? (
        <BuyerProvider>
          <BuyerNavigator />
        </BuyerProvider>
      ) : user?.Role === 'Seller' ? (
        <SellerNavigator />
      ) : null}
    </MasterProvider>
  );
};
export default MainNavigator;
