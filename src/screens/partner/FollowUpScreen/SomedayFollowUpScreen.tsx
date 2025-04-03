import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FollowUpStackParamList} from '../../../navigator/components/FollowUpScreenStack';
import { ScrollView, Text, View } from 'react-native';
import Header from '../../../components/Header';

type Props = NativeStackScreenProps<
  FollowUpStackParamList,
  'SomedayFollowUpScreen'
>;

const SomedayFollowUpScreen: React.FC<Props> = ({navigation}) => {
  return (
    <View>
      <Header title="Someday Follow Up" backButton={true} navigation={navigation} />
      <ScrollView>
        <Text>Someday Follow Up Screen</Text>
        {/* Add your content here */}
      </ScrollView>
    </View>
  );
};

export default SomedayFollowUpScreen;
