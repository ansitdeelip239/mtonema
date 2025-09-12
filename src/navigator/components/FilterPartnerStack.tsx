import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../../context/ThemeProvider';
import FilterPartnerScreen from '../../screens/partner/FilterPartnerScreen/FilterPartnerScreen';
import { useTranslation } from 'react-i18next';

export type FilterPartnerStackParamList = {
  FilterPartnerScreen: undefined;
};

const Stack = createNativeStackNavigator<FilterPartnerStackParamList>();

const FilterPartnerStack = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isIOS = Platform.OS === 'ios';

  return (
    <Stack.Navigator
      initialRouteName="FilterPartnerScreen"
      screenOptions={{
        headerShown: isIOS,
        headerStyle: { backgroundColor: theme.primaryColor },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerBackVisible: false, // Disable automatic back button
        headerBackTitle: t('common.actions.back'),
      }}
    >
      <Stack.Screen
        name="FilterPartnerScreen"
        component={FilterPartnerScreen}
        options={({ navigation }) => ({
          title: t('partnerFilter.title.partners'),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 16, padding: 4 }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                ← {t('common.actions.back')}
              </Text>
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};;

export default FilterPartnerStack;
