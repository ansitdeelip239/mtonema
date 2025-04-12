import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Header from '../../components/Header';
import {PartnerDrawerParamList} from '../../types/navigation';

const UnderDevelopment: React.FC = () => {
  return (
    <>
      <Header<PartnerDrawerParamList> title="Under Development" />
      <View style={styles.container}>
        <Text style={styles.title}>Under Development</Text>
        <Text style={styles.description}>
          We're working hard to bring you something amazing. Please check back
          later!
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
});

export default UnderDevelopment;
