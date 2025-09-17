import {createDrawerNavigator} from '@react-navigation/drawer';
import React, {memo} from 'react';
import CustomDrawerContent from '../components/CustomDrawerContent';
import GetIcon from '../components/GetIcon';
import {StatusBar} from 'react-native';
import BuyerBottomTabs from './components/BuyerBottomTabs';
import PartnerProfileScreen from '../screens/partner/ProfileScreen/ProfileScreen';
import {useDrawerStyles} from '../hooks/useDrawerStyles';
import SettingsScreen from '../screens/partner/Settings/SettingsScreen';
import {useTranslation} from 'react-i18next';
import DrawerToggleButton from '../components/DrawerToggleButton';
import HelpCenterScreen from '../screens/partner/HelpCenterScreen';

const Drawer = createDrawerNavigator();

const BuyerNavigator = memo(() => {
  const {drawerStyles, isIOS} = useDrawerStyles();

  const {t} = useTranslation();

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#fff" translucent={false} />
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
            headerShown: isIOS,
            // eslint-disable-next-line react/no-unstable-nested-components
            headerLeft: () => <DrawerToggleButton />,
            title: t('settings.title', 'Settings'),
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
        <Drawer.Screen
          name="Help Center"
          component={HelpCenterScreen}
          options={{
            headerShown: isIOS,
            // eslint-disable-next-line react/no-unstable-nested-components
            headerLeft: () => <DrawerToggleButton />,
            title: t('navigation.drawer.helpCenter', 'Help Center'),
            drawerItemStyle: {display: 'none'},
          }}
        />
      </Drawer.Navigator>
    </>
  );
});

export default BuyerNavigator;
