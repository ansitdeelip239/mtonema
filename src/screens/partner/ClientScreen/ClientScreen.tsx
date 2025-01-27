import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Text, View} from 'react-native';
import {BottomTabParamList} from '../../../types/navigation';

type Props = BottomTabScreenProps<BottomTabParamList, 'Clients'>;

const ClientScreen: React.FC<Props> = () => {
  return (
    <View>
      <Text>PartnerScreen</Text>
    </View>
  );
};

export default ClientScreen;
