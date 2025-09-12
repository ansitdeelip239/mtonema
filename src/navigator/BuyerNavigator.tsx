import {createDrawerNavigator} from '@react-navigation/drawer';
import React, {memo} from 'react';
import CustomDrawerContent from '../components/CustomDrawerContent';
import GetIcon from '../components/GetIcon';
import {StatusBar, StyleSheet} from 'react-native';
import BuyerBottomTabs from './components/BuyerBottomTabs';
import {SafeAreaView} from 'react-native-safe-area-context';
import PartnerProfileScreen from '../screens/partner/ProfileScreen/ProfileScreen';
import {useDrawerStyles} from '../hooks/useDrawerStyles';
import SettingsScreen from '../screens/partner/Settings/SettingsScreen';
import {useTranslation} from 'react-i18next';

const Drawer = createDrawerNavigator();

const BuyerNavigator = memo(() => {
  const {drawerStyles, isIOS} = useDrawerStyles();

  const {t} = useTranslation();

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Drawer.Navigator
        // eslint-disable-next-line react/no-unstable-nested-components
        drawerContent={props => <CustomDrawerContent {...props} />}
        initialRouteName="Home"
        screenOptions={{
          ...drawerStyles,
          headerShown: true,
        }}>
        <Drawer.Screen
          name="Home"
          component={BuyerBottomTabs}
          options={{
            headerShown: false,
            drawerLabel: t('navigation.drawer.home'), // Add localized label
            // eslint-disable-next-line react/no-unstable-nested-components
            drawerIcon: ({color}) => (
              <GetIcon iconName="home" color={color} size="23" /> // Use GetIcon here
            ),
          }}
        />
        <Drawer.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            headerShown: false,
            drawerLabel: t('navigation.drawer.settings'), // Add localized label
            // eslint-disable-next-line react/no-unstable-nested-components
            drawerIcon: ({color}) => (
              <GetIcon iconName="settings" color={color} size="25" />
            ),
          }}
        />
        <Drawer.Screen
          name="Profile Screen"
          component={PartnerProfileScreen}
          options={{
            headerShown: isIOS,
            drawerItemStyle: {display: 'none'},
          }}
        />
      </Drawer.Navigator>
    </>
  );
});

export default BuyerNavigator;
