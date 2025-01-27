import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Text, View} from 'react-native';
import { PartnerBottomTabParamList, PartnerDrawerParamList } from '../../../types/navigation';
import Header from '../../../components/Header';

type Props = BottomTabScreenProps<PartnerBottomTabParamList, 'Clients'>;

const ClientScreen: React.FC<Props> = () => {
  return (
    <View>
      <Header<PartnerDrawerParamList> title="Clients" />
      <Text>Client Screen</Text>
    </View>
  );
};

export default ClientScreen;
