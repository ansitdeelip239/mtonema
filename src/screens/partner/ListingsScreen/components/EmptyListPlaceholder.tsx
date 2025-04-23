import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
// import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native-paper';
import Colors from '../../../../constants/Colors';

const EmptyListPlaceholder = () => {
  // const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../assets/Images/AboutImage.jpg')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>No Properties Found</Text>
      <Text style={styles.subtitle}>
        You haven't added any properties yet. Get started by adding your first
        property.
      </Text>
      <Button
        mode="contained"
        style={styles.button}
        labelStyle={styles.buttonLabel}
        // onPress={() => navigation.navigate('AddProperty')}
        >
        Add Property
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginTop: 50,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: Colors.MT_PRIMARY_1,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EmptyListPlaceholder;
