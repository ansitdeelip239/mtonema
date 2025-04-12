import React, {memo} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import GetIcon from '../../components/GetIcon';
import Colors from '../../constants/Colors';
import {PartnerBottomTabParamList} from '../../types/navigation';
import ClientScreenStack from './ClientScreenStack';
import {CustomBottomBar, TabScreen} from './CustomBottomBar';
import FollowUpScreenStack from './FollowUpScreenStack';
import AgentDataScreenStack from './AgentDataStack';
import UnderDevelopment from '../../screens/partner/UnderDevelopment';

const Tab = createBottomTabNavigator<PartnerBottomTabParamList>();

const tabScreens: Array<TabScreen<PartnerBottomTabParamList>> = [
  {
    name: 'FollowUp',
    component: FollowUpScreenStack,
    icon: 'calendar',
    label: 'Follow Ups', // Add a custom label that will be used in display
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
    component: UnderDevelopment,
    icon: 'listproperty',
    label: 'Add', // Shorter label for this tab
  },
  {
    name: 'Property',
    component: UnderDevelopment,
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
        fontSize: 10, // Reduce font size
        lineHeight: 12, // Control line height
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
