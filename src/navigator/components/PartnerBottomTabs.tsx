import React, {memo} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import GetIcon from '../../components/GetIcon';
import Colors from '../../constants/Colors';
import HomeScreen from '../../screens/partner/HomeScreen/HomeScreen';
import {PartnerBottomTabParamList} from '../../types/navigation';
import AddAgentPropertyScreen from '../../screens/partner/AddAgentPropertyScreen/AddAgentPropertyScreen';
import AgentDataScreen from '../../screens/partner/AgentsPropertyScreen/AgentsPropertyScreen';
import PartnerProfileScreen from '../../screens/partner/ProfileScreen/ProfileScreen';
import ClientScreenStack from './ClientScreenStack';
import {CustomBottomBar, TabScreen} from './CustomBottomBar';

const Tab = createBottomTabNavigator<PartnerBottomTabParamList>();

const tabScreens: Array<TabScreen<PartnerBottomTabParamList>> = [
  {
    name: 'Home',
    component: HomeScreen,
    icon: 'home',
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
    component: AddAgentPropertyScreen,
    icon: 'property',
  },
  {
    name: 'Property',
    component: AgentDataScreen,
    icon: 'realEstate',
  },
  {
    name: 'Profile',
    component: PartnerProfileScreen,
    icon: 'user',
  },
] as const;

const PartnerBottomTabs = memo(() => (
  <Tab.Navigator
    initialRouteName="Property"
    screenOptions={{
      headerShown: false,
    }}
    // eslint-disable-next-line react/no-unstable-nested-components
    tabBar={props => (
      <CustomBottomBar
        {...props}
        tabScreens={tabScreens}
      />
    )}>
    {tabScreens.map(({name, component, icon, listeners}) => (
      <Tab.Screen
        key={name}
        name={name}
        component={component}
        options={{
          tabBarLabel: name,
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
