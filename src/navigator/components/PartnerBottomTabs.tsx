import React, {memo} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import GetIcon from '../../components/GetIcon';
import {PartnerBottomTabParamList} from '../../types/navigation';
import ClientScreenStack from './ClientScreenStack';
import {CustomBottomBar, TabScreen} from './CustomBottomBar';
import FollowUpScreenStack from './FollowUpScreenStack';
import AgentDataScreenStack from './AgentDataStack';
import ListingScreenStack from './PropertyListingScreenStack';
import {useTheme} from '../../context/ThemeProvider';
import {CommonActions} from '@react-navigation/native';
import AddPropertyStack from './AddPropertyStack';
import {useTranslation} from 'react-i18next';

const Tab = createBottomTabNavigator<PartnerBottomTabParamList>();

const PartnerBottomTabs = () => {
  const {theme} = useTheme();
  const {t} = useTranslation();

  // Move tabScreens inside component to access t() function
  const tabScreens: Array<TabScreen<PartnerBottomTabParamList>> = [
    {
      name: 'FollowUp',
      component: FollowUpScreenStack,
      icon: 'calendar',
      label: t('navigation.partner.bottomTab.followUp', 'Follow Ups'),
    },
    {
      name: 'Clients',
      component: ClientScreenStack,
      icon: 'client',
      label: t('navigation.partner.bottomTab.clients', 'Clients'),
      listeners: ({navigation}) => ({
        tabPress: () => {
          // Reset the Clients stack to show only ClientScreen
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'Clients',
                  state: {
                    routes: [{name: 'ClientScreen'}],
                    index: 0,
                  },
                },
              ],
            }),
          );
        },
      }),
    },
    {
      name: 'AddProperty',
      component: AddPropertyStack,
      icon: 'listproperty',
      label: t('navigation.partner.bottomTab.add', 'Add'),
    },
    {
      name: 'Property',
      component: ListingScreenStack,
      icon: 'home',
      label: t('navigation.partner.bottomTab.listings', 'Listings'),
    },
    {
      name: 'AgentData',
      component: AgentDataScreenStack,
      icon: 'realEstate',
      label: t('navigation.partner.bottomTab.agentData', 'Agent Data'),
    },
  ] as const;

  return (
    <Tab.Navigator
      initialRouteName="FollowUp"
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 10,
          lineHeight: 12,
        },
      }}
      // eslint-disable-next-line react/no-unstable-nested-components
      tabBar={props => <CustomBottomBar {...props} tabScreens={tabScreens} />}>
      {tabScreens.map(({name, component, icon, listeners, label}) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            tabBarShowLabel: true,
            tabBarLabel: label,
            // eslint-disable-next-line react/no-unstable-nested-components
            tabBarIcon: ({focused, color}) => (
              <GetIcon
                iconName={icon}
                color={focused ? theme.primaryColor : color}
              />
            ),
          }}
          listeners={listeners}
        />
      ))}
    </Tab.Navigator>
  );
};

export default memo(PartnerBottomTabs);
