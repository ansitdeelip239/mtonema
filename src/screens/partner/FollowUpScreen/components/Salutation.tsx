import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { useAuth } from '../../../../hooks/useAuth';
import { useTheme } from '../../../../context/ThemeProvider';
import GetIcon from '../../../../components/GetIcon';
import { getGreeting } from '../../../../utils/dateUtils';

const SalutationGreeting: React.FC = () => {
  const {user} = useAuth();
  const {theme} = useTheme();

  return (
    <View style={styles.salutationContainer}>
      <View
        style={[
          styles.salutationInner,
          {backgroundColor: theme.backgroundColor},
        ]}>
        <GetIcon
          iconName={(() => {
            const hour = new Date().getHours();
            if (hour >= 5 && hour < 12) {
              return 'morning';
            }
            if (hour >= 12 && hour < 17) {
              return 'afternoon';
            }
            return 'evening';
          })()}
          size={32}
        />
        <View style={styles.salutationTextWrapper}>
          <Text style={[styles.salutationHi, {color: theme.textColor}]}>
            Hi
            {user?.name
              ? (() => {
                  const parts = user.name.split(' ');
                  if (parts.length > 1 && parts[0].endsWith('.')) {
                    return `, ${parts[1]}`;
                  }
                  return `, ${parts[0]}`;
                })()
              : ''}
            !
          </Text>
          <Text
            style={[styles.salutationGreeting, {color: theme.secondaryColor}]}>
            {getGreeting()}
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
