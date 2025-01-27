import {NavigatorScreenParams} from '@react-navigation/native';

export type AgentStackParamList = {
  AgentPropertyList: undefined;
  AddAgentProperty: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Property: NavigatorScreenParams<AgentStackParamList>;
  Clients: undefined;
  Test: undefined;
};

export type DrawerParamList = {
  'Home Screen': NavigatorScreenParams<BottomTabParamList>;
  'Profile Screen': undefined;
};
