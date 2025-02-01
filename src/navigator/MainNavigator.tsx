// import { View, Text } from 'react-native'
import React from 'react';
import SellerNavigator from './SellerNavigator';
import BuyerNavigator from './BuyerNavigator';
import {useAuth} from '../hooks/useAuth';
import {BuyerProvider} from '../context/BuyerProvider';
import {MasterProvider} from '../context/MasterProvider';
import PartnerNavigator from './PartnerNavigator';
import {PartnerProvider} from '../context/PartnerProvider';
import {PropertyFormProvider} from '../context/PropertyFormContext';

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
        <PropertyFormProvider>
          <SellerNavigator />
        </PropertyFormProvider>
      ) : user?.Role === 'Partner' ? (
        <PartnerProvider>
          <PartnerNavigator />
        </PartnerProvider>
      ) : null}
    </MasterProvider>
  );
};
export default MainNavigator;
