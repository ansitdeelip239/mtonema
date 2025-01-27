import React from 'react';
import {View, Text} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {
  PartnerBottomTabParamList,
  PartnerDrawerParamList,
} from '../../../types/navigation';
import Header from '../../../components/Header';

type Props = BottomTabScreenProps<PartnerBottomTabParamList, 'Home'>;

const HomeScreen: React.FC<Props> = () => {
  return (
    <View>
      <Header<PartnerDrawerParamList> title="Home" />
      <Text>HomeScreen</Text>
    </View>
  );
};

export default HomeScreen;
