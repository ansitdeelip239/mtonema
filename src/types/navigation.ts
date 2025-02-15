import {NavigatorScreenParams} from '@react-navigation/native';
import {ClientStackParamList} from '../navigator/components/ClientScreenStack';

export type AgentStackParamList = {
  AgentPropertyList: undefined;
  AddAgentProperty: undefined;
};

export type AdminBottomTabParamList = {
  Home: undefined;
  Property: undefined;
  AddProperty: {editMode: boolean; propertyData: any};
  Clients: undefined;
  Profile: undefined;
};

export type PartnerBottomTabParamList = {
  Home: undefined;
  Property: undefined;
  AddProperty: {editMode: boolean; propertyData: any};
  Clients: NavigatorScreenParams<ClientStackParamList>;
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

export type AdminDrawerParamList = {
  'Home Screen': NavigatorScreenParams<PartnerBottomTabParamList>;
  'Profile Screen': undefined;
};
