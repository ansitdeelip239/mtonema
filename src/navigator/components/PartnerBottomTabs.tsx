import React, {memo} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import GetIcon from '../../components/GetIcon';
import Colors from '../../constants/Colors';
import {PartnerBottomTabParamList} from '../../types/navigation';
import ClientScreenStack from './ClientScreenStack';
import {CustomBottomBar, TabScreen} from './CustomBottomBar';
import FollowUpScreenStack from './FollowUpScreenStack';
import AgentDataScreenStack from './AgentDataStack';
import AddPartnerPropertyScreen from '../../screens/partner/AddPartnerPropertyScreen/AddPartnerPropertyScreen';
import ListingScreenStack from './PropertyListingScreenStack';

const Tab = createBottomTabNavigator<PartnerBottomTabParamList>();

const tabScreens: Array<TabScreen<PartnerBottomTabParamList>> = [
  {
    name: 'FollowUp',
    component: FollowUpScreenStack,
    icon: 'calendar',
    label: 'Follow Ups',
  },
  {
    name: 'Clients',
    component: ClientScreenStack,
    icon: 'client',
    listeners: ({navigation}) => ({
      tabPress: () => {
        navigation.navigate('Clients', {
          screen: 'ClientScreen',
        });
      },
    }),
  },
  {
    name: 'AddProperty',
    component: AddPartnerPropertyScreen,
    icon: 'listproperty',
    label: 'Add',
  },
  {
    name: 'Property',
    component: ListingScreenStack,
    icon: 'home',
    label: 'Listings',
  },
  {
    name: 'AgentData',
    component: AgentDataScreenStack,
    icon: 'realEstate',
    label: 'Agent Data',
  },
] as const;

const PartnerBottomTabs = memo(() => (
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
          tabBarLabel: label, // Use the custom label if provided
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({focused, color}) => (
            <GetIcon iconName={icon} color={focused ? Colors.main : color} />
          ),
        }}
        listeners={listeners}
      />
    ))}
  </Tab.Navigator>
));

export default PartnerBottomTabs;
