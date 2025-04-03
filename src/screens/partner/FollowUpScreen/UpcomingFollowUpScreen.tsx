import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FollowUpStackParamList } from '../../../navigator/components/FollowUpScreenStack';
import Header from '../../../components/Header';

type Props = NativeStackScreenProps<FollowUpStackParamList, 'UpcomingFollowUpScreen'>;

const UpcomingFollowUpScreen: React.FC<Props> = ({navigation}) => {
  return (
    <View>
      <Header title="Upcoming Follow Up" backButton={true} navigation={navigation} />
      <ScrollView>
        <Text>Upcoming Follow Up Screen</Text>
        {/* Add your content here */}
      </ScrollView>
    </View>
  );
};

export default UpcomingFollowUpScreen;
