import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useAuth} from '../../../../hooks/useAuth';
import {useTheme} from '../../../../context/ThemeProvider';
import GetIcon from '../../../../components/GetIcon';
import {getTimeIcon, getFirstName, getGreetingTranslationKey} from '../../../../utils/dateUtils';
import {useTranslation} from 'react-i18next';

const SalutationGreeting: React.FC = () => {
  const {t} = useTranslation();
  const {user} = useAuth();
  const {theme} = useTheme();

  // ✅ Define all translations at the top
  const translations = {
    hi: t('screens.followUpScreen.salutationGreeting.hi'),
    greeting: t(getGreetingTranslationKey()),
  };

  return (
    <View style={styles.salutationContainer}>
      <View
        style={[
          styles.salutationInner,
          {backgroundColor: theme.backgroundColor},
        ]}>
        <GetIcon iconName={getTimeIcon()} size={32} />
        <View style={styles.salutationTextWrapper}>
          <Text style={[styles.salutationHi, {color: theme.textColor}]}>
            {translations.hi}
            {user?.name ? `, ${getFirstName(user.name)}` : ''}!
          </Text>
          <Text
            style={[styles.salutationGreeting, {color: theme.secondaryColor}]}>
            {translations.greeting}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  salutationContainer: {
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  salutationInner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    gap: 12,
  },
  salutationTextWrapper: {
    flex: 1,
  },
  salutationHi: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  salutationGreeting: {
    fontSize: 16,
    fontWeight: '400',
  },
});

export default SalutationGreeting;
