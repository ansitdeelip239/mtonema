import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
// import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native-paper';
import { useTheme } from '../../../../context/ThemeProvider';
import { useTranslation } from 'react-i18next';

const EmptyListPlaceholder = () => {
  // const navigation = useNavigation();
  const {theme} = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../assets/Images/AboutImage.jpg')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>{t('listings.titles.noPropertiesFound')}</Text>
      <Text style={styles.subtitle}>
        {t('listings.messages.emptyState')}
      </Text>
      <Button
        mode="contained"
        style={[styles.button, {backgroundColor: theme.primaryColor}]}
        labelStyle={styles.buttonLabel}
        // onPress={() => navigation.navigate('AddProperty')}
        >
        {t('listings.buttons.addProperty')}
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
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EmptyListPlaceholder;
