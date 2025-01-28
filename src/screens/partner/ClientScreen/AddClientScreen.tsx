import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Header from '../../../components/Header';
import {PartnerDrawerParamList} from '../../../types/navigation';
import Colors from '../../../constants/Colors';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ClientStackParamList} from '../../../navigator/components/ClientScreenStack';

type Props = NativeStackScreenProps<ClientStackParamList, 'AddClientScreen'>;

const AddClientScreen: React.FC<Props> = ({navigation}) => {
  return (
    <View>
      <Header<PartnerDrawerParamList> title="Add Client">
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            navigation.goBack();
          }}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </Header>
      <Text>AddClientScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: Colors.main,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AddClientScreen;
