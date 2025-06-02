import {NavigatorScreenParams} from '@react-navigation/native';
import {ClientStackParamList} from '../navigator/components/ClientScreenStack';
import { ListingScreenStackParamList } from '../navigator/components/PropertyListingScreenStack';

export type AgentStackParamList = {
  AgentPropertyList: undefined;
  AddAgentProperty: undefined;
};

export type PartnerAdminBottomTabParamList = {
  Partners: undefined;
  Property: undefined;
  AddProperty: {editMode: boolean; propertyData: any};
  Clients: undefined;
  Profile: undefined;
};

export type BuyerSellerAdminBottomTabParamList = {
  Visitors: undefined;
  Property: undefined;
  AddProperty: {editMode: boolean; propertyData: any};
  Users: undefined;
  Inquiries: undefined;
};

export type PartnerBottomTabParamList = {
  FollowUp: undefined;
  Property: { screen: keyof ListingScreenStackParamList } | undefined;
  AddProperty: undefined;
  Clients: NavigatorScreenParams<ClientStackParamList>;
  AgentData: undefined;
};

export type SellerBottomTabParamList = {
  Home: undefined;
  Property: undefined;
  AddProperty: undefined;
  Clients: undefined;
  Profile: undefined;
};

export type PartnerDrawerParamList = {
  'Home': NavigatorScreenParams<PartnerBottomTabParamList>;
  'Groups': undefined;
  'Content': undefined;
  'Profile Screen': undefined;
  'Feedback': undefined
};

export type AdminDrawerParamList = {
  'Partner': NavigatorScreenParams<PartnerAdminBottomTabParamList>;
  'Buyer/Seller': NavigatorScreenParams<PartnerBottomTabParamList>;
  'Profile Screen': undefined;
};
