import {NavigatorScreenParams} from '@react-navigation/native';

export type AgentStackParamList = {
  AgentPropertyList: undefined;
  AddAgentProperty: undefined;
};

export type PartnerBottomTabParamList = {
  Home: undefined;
  Property: undefined;
  AddProperty: {editMode: boolean; propertyData: any};
  Clients: undefined;
  Profile: undefined;
};

export type SellerBottomTabParamList = {
  Home: undefined;
  Property: undefined;
  AddProperty: undefined;
  Clients: undefined;
  Profile: undefined;
};

export type PartnerDrawerParamList = {
  'Home Screen': NavigatorScreenParams<PartnerBottomTabParamList>;
  'Profile Screen': undefined;
};

