import React, {memo} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import GetIcon from '../../components/GetIcon';
import {TabScreen} from './CustomBottomBar';
import {useTheme} from '../../context/ThemeProvider';
import {PaymentBottomTabParamList} from '../../types/navigation';
import PlansStack from './PlansStack';
import {PaymentBottomBar} from './PaymentBottomBar';
import TransactionsStack from './TransactionsStack';
import {useTranslation} from 'react-i18next';

const Tab = createBottomTabNavigator<PaymentBottomTabParamList>();

const PaymentBottomTabs = () => {
  const {theme} = useTheme();
  const {t} = useTranslation();

  const tabScreens: Array<TabScreen<PaymentBottomTabParamList>> = [
    {
      name: 'Plans',
      component: PlansStack,
      icon: 'calendar',
      label: t('navigation.paymentTabs.plans', 'Plans'),
    },
    {
      name: 'Transactions',
      component: TransactionsStack,
      icon: 'transaction',
      label: t('navigation.paymentTabs.transactions', 'Transactions'),
    },
  ] as const;

  return (
    <Tab.Navigator
      initialRouteName="Plans"
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 10,
          lineHeight: 12,
        },
      }}
      // eslint-disable-next-line react/no-unstable-nested-components
      tabBar={props => <PaymentBottomBar {...props} tabScreens={tabScreens} />}>
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

export default memo(PaymentBottomTabs);
