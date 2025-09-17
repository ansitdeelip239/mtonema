/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {TouchableOpacity} from 'react-native';
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
import DrawerToggleButton from '../components/DrawerToggleButton';
import HelpCenterScreen from '../screens/partner/HelpCenterScreen';

const Drawer = createDrawerNavigator<PartnerDrawerParamList>();

const PartnerNavigator = () => {
  const {t} = useTranslation();
  const {drawerStyles, isIOS} = useDrawerStyles();

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        ...drawerStyles,
      }}
      initialRouteName="Home">
      <Drawer.Screen
        name="Home"
        component={PartnerBottomTabs}
        options={{
          headerShown: false,
          drawerLabel: t('navigation.drawer.home'), // Add localized label
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
          headerLeft: () => <DrawerToggleButton />,
          drawerLabel: t('navigation.drawer.groups'), // Add localized label
          drawerIcon: ({color}) => (
            <GetIcon iconName="group" color={color} size="25" />
          ),
        }}
      />

      <Drawer.Screen
        name="Teams"
        component={TeamStack}
        options={({navigation}) => ({
          headerShown: isIOS,
          headerLeft: () => <DrawerToggleButton />,
          headerRight: isIOS ? () => (
            <TouchableOpacity 
              onPress={() => {
                // Navigate to the nested screen in the TeamStack
                const teamNavigation = navigation as any;
                teamNavigation.navigate('Teams', {
                  screen: 'Add Teams Screen'
                });
              }}
              style={{ marginRight: 16 }}
            >
              <GetIcon 
                iconName="plus" 
                color="white" 
                size={24} 
              />
            </TouchableOpacity>
          ) : undefined,
          drawerLabel: t('navigation.drawer.teams'), // Add localized label
          drawerIcon: ({color}) => (
            <GetIcon iconName="partner" color={color} size="25" />
          ),
        })}
      />

      <Drawer.Screen
        name="Content"
        component={ContentTemplateScreenStack}
        options={{
          headerShown: false,
          drawerLabel: t('navigation.drawer.content'), // Add localized label
          drawerIcon: ({color}) => (
            <GetIcon iconName="notes" color={color} size="25" />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: isIOS,
          headerLeft: () => <DrawerToggleButton />,
          drawerLabel: t('navigation.drawer.settings'), // Add localized label
          drawerIcon: ({color}) => (
            <GetIcon iconName="settings" color={color} size="25" />
          ),
        }}
      />
      <Drawer.Screen
        name="Help Center"
        component={HelpCenterScreen}
        options={{
          headerShown: isIOS,
          headerLeft: () => <DrawerToggleButton />,
          title: t('navigation.drawer.helpCenter', 'Help Center'),
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="Profile Screen"
        component={PartnerProfileScreen}
        options={{
          headerShown: isIOS,
          headerLeft: () => <DrawerToggleButton />,
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
