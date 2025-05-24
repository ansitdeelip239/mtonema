// import { View, Text } from 'react-native'
import React from 'react';
import SellerNavigator from './SellerNavigator';
import BuyerNavigator from './BuyerNavigator';
import {useAuth} from '../hooks/useAuth';
import {BuyerProvider} from '../context/BuyerProvider';
import PartnerNavigator from './PartnerNavigator';
import {PartnerProvider} from '../context/PartnerProvider';
import {PropertyFormProvider} from '../context/PropertyFormContext';
import Roles from '../constants/Roles';
import AdminNavigator from './AdminNavigator';

const MainNavigator = () => {
  const {user} = useAuth();

  return (
    <>
      {user?.role === Roles.BUYER ? (
        <BuyerProvider>
          <BuyerNavigator />
        </BuyerProvider>
      ) : user?.role === Roles.SELLER ? (
        <PropertyFormProvider>
          <SellerNavigator />
        </PropertyFormProvider>
      ) : user?.role === Roles.PARTNER || user?.role === Roles.TEAM ? (
        <PartnerProvider>
          <PartnerNavigator />
        </PartnerProvider>
      ) : user?.role === Roles.ADMIN ? (
        <AdminNavigator />
      ) : null}
    </>
  );
};
export default MainNavigator;
