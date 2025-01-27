import {NavigatorScreenParams} from '@react-navigation/native';

export type AgentStackParamList = {
  AgentPropertyList: undefined;
  AddAgentProperty: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Property: undefined;
  AddProperty: undefined;
  Clients: undefined;
  Test: undefined;
};

export type PartnerDrawerParamList = {
  'Home Screen': NavigatorScreenParams<BottomTabParamList>;
  'Profile Screen': undefined;
};
