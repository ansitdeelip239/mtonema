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
import {BottomTabProvider} from '../context/BottomTabProvider';

const MainNavigator = () => {
  const {user} = useAuth();

  // Array of allowed admin emails
  const allowedAdminEmails = [
    'info@dncrproperty.com',
    'shashi225@gmail.com',
    'atique159@gmail.com',
  ];

  // Check if user has admin role and email is in the allowed list
  const isAuthorizedAdmin =
    user?.role === Roles.ADMIN &&
    user?.email &&
    allowedAdminEmails.includes(user.email);

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
      ) : user?.role === Roles.PARTNER ||
        user?.role === Roles.TEAM ||
        isAuthorizedAdmin ? (
        <BottomTabProvider>
          <PartnerProvider>
            <PartnerNavigator />
          </PartnerProvider>
        </BottomTabProvider>
      ) : // ) : user?.role === Roles.ADMIN ? (
      //   <AdminNavigator />
      null}
    </>
  );
};
export default MainNavigator;
