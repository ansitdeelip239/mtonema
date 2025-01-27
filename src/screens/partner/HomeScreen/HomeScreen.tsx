import React from 'react';
import {View, Text} from 'react-native';
import {BottomTabParamList} from '../../../types/navigation';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';

type Props = BottomTabScreenProps<BottomTabParamList, 'Home'>;

const HomeScreen: React.FC<Props> = () => {
  return (
    <View>
      <Text>HomeScreen</Text>
    </View>
  );
};

export default HomeScreen;
