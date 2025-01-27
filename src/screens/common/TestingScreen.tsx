import {View, Text} from 'react-native';
import React from 'react';
import Header from '../../components/Header';

const TestingScreen = () => {
  return (
    <View>
         <Header title="Empty Screen"/>
      <Text>This screen is blank screen. its only use for testing purpose.</Text>
    </View>
  );
};

export default TestingScreen;
