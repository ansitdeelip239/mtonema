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
import Roles from '../constants/Roles';
import AdminNavigator from './AdminNavigator';

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
      {user?.Role === Roles.BUYER ? (
        <BuyerProvider>
          <BuyerNavigator />
        </BuyerProvider>
      ) : user?.Role === Roles.SELLER ? (
        <PropertyFormProvider>
          <SellerNavigator />
        </PropertyFormProvider>
      ) : user?.Role === Roles.PARTNER ? (
        <PartnerProvider>
          <PartnerNavigator />
        </PartnerProvider>
      ) : user?.Role === Roles.ADMIN ? (
        <AdminNavigator />
      ) : null}
    </MasterProvider>
  );
};
export default MainNavigator;
