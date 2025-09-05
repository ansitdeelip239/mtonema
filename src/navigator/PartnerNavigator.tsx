import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawerContent from '../components/CustomDrawerContent';
import {PartnerDrawerParamList} from '../types/navigation';
import PartnerBottomTabs from './components/PartnerBottomTabs';
import GroupsScreen from '../screens/partner/GroupsScreen/GroupsScreen';
import GetIcon from '../components/GetIcon';
import PartnerProfileScreen from '../screens/partner/ProfileScreen/ProfileScreen';
import ContentTemplateScreenStack from './components/ContentTemplateStack';
import FilterPartnerStack from './components/FilterPartnerStack';
import PaymentBottomTabs from './components/PaymentBottomTabs';
import TeamStack from './components/TeamStack';
import SettingsScreen from '../screens/partner/Settings/SettingsScreen';
import {useTranslation} from 'react-i18next';
import {useDrawerStyles} from '../hooks/useDrawerStyles';

const Drawer = createDrawerNavigator<PartnerDrawerParamList>();

const PartnerNavigator = () => {
  const {t} = useTranslation();
  const {drawerStyles, isIOS} = useDrawerStyles();

  return (
    <Drawer.Navigator
      // eslint-disable-next-line react/no-unstable-nested-components
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        ...drawerStyles,
        swipeEnabled: !isIOS,
      }}
      initialRouteName="Home">
      <Drawer.Screen
        name="Home"
        component={PartnerBottomTabs}
        options={{
          headerShown: false,
          drawerLabel: t('navigation.drawer.home'), // Add localized label
          // eslint-disable-next-line react/no-unstable-nested-components
          drawerIcon: ({color}) => (
            <GetIcon iconName="home" color={color} size="25" />
          ),
        }}
      />
      <Drawer.Screen
        name="Groups"
        component={GroupsScreen}
        options={{
          headerShown: isIOS,
          drawerLabel: t('navigation.drawer.groups'), // Add localized label
          // eslint-disable-next-line react/no-unstable-nested-components
          drawerIcon: ({color}) => (
            <GetIcon iconName="group" color={color} size="25" />
          ),
        }}
      />

      <Drawer.Screen
        name="Teams"
        component={TeamStack}
        options={{
          headerShown: isIOS,
          drawerLabel: t('navigation.drawer.teams'), // Add localized label
          // eslint-disable-next-line react/no-unstable-nested-components
          drawerIcon: ({color}) => (
            <GetIcon iconName="partner" color={color} size="25" />
          ),
        }}
      />

      <Drawer.Screen
        name="Content"
        component={ContentTemplateScreenStack}
        options={{
          headerShown: false,
          drawerLabel: t('navigation.drawer.content'), // Add localized label
          // eslint-disable-next-line react/no-unstable-nested-components
          drawerIcon: ({color}) => (
            <GetIcon iconName="notes" color={color} size="25" />
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
      {/* Hidden Filter Screen */}
      <Drawer.Screen
        name="Filter Partners"
        component={FilterPartnerStack}
        options={{
          headerShown: false,
          drawerItemStyle: {display: 'none'},
        }}
      />

      {/* Payments Screen */}
      <Drawer.Screen
        name="Payments"
        component={PaymentBottomTabs}
        options={{
          headerShown: false,
          drawerItemStyle: {display: 'none'},
        }}
      />
    </Drawer.Navigator>
  );
};

export default React.memo(PartnerNavigator);
