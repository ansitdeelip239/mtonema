import React, {memo} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {CommonActions} from '@react-navigation/native';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import GetIcon, {IconEnum} from '../../components/GetIcon';
import Colors from '../../constants/Colors';
import HomeScreen from '../../screens/partner/HomeScreen/HomeScreen';
import ClientScreen from '../../screens/partner/ClientScreen/ClientScreen';
import {PartnerBottomTabParamList} from '../../types/navigation';
import AddAgentPropertyScreen from '../../screens/partner/AddAgentPropertyScreen/AddAgentPropertyScreen';
import AgentDataScreen from '../../screens/partner/AgentsPropertyScreen/AgentsPropertyScreen';
import PartnerProfileScreen from '../../screens/partner/ProfileScreen/ProfileScreen';

const Tab = createBottomTabNavigator<PartnerBottomTabParamList>();

const tabScreens: Array<{
  name: keyof PartnerBottomTabParamList;
  component: React.FC<any>;
  icon: IconEnum;
}> = [
  {
    name: 'Home',
    component: HomeScreen,
    icon: 'home',
  },
  {
    name: 'Property',
    component: AgentDataScreen,
    icon: 'realEstate',
  },
  {
    name: 'AddProperty',
    component: AddAgentPropertyScreen,
    icon: 'property',
  },
  {
    name: 'Clients',
    component: ClientScreen,
    icon: 'client',
  },
  {
    name: 'Profile',
    component: PartnerProfileScreen,
    icon: 'user',
  },
] as const;

const CustomBottomBar = memo(
  ({navigation, state, descriptors}: BottomTabBarProps) => {
    const middleIndex = Math.floor(tabScreens.length / 2);

    return (
      <View style={styles.bottomBarContainer}>
        <View style={styles.bottomBar}>
          <View style={styles.tabSection}>
            {state.routes.slice(0, middleIndex).map((route, index) => (
              <TouchableOpacity
                key={route.key}
                style={[styles.tab, state.index === index && styles.activeTab]}
                onPress={() => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });

                  if (!event.defaultPrevented) {
                    navigation.dispatch({
                      ...CommonActions.navigate(route.name, route.params),
                      target: state.key,
                    });
                  }
                }}>
                <View style={styles.tabContent}>
                  {descriptors[route.key].options.tabBarIcon?.({
                    focused: state.index === index,
                    color: state.index === index ? Colors.main : '#666',
                    size: 24,
                  })}
                  <Text
                    style={[
                      styles.tabLabel,
                      state.index === index && styles.activeTabLabel,
                    ]}>
                    {route.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            key={state.routes[middleIndex].key}
            style={[
              styles.centerTab,
              state.index === middleIndex && styles.activeCenterTab,
            ]}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: state.routes[middleIndex].key,
                canPreventDefault: true,
              });

              if (!event.defaultPrevented) {
                navigation.dispatch({
                  ...CommonActions.navigate(state.routes[middleIndex].name),
                  target: state.key,
                });
              }
            }}>
            <GetIcon iconName="property" color="#fff" />
          </TouchableOpacity>

          <View style={styles.tabSection}>
            {state.routes.slice(middleIndex + 1).map((route, index) => (
              <TouchableOpacity
                key={route.key}
                style={[
                  styles.tab,
                  state.index === index + middleIndex + 1 && [
                    styles.activeTab,
                    styles.activeTabColor,
                  ],
                ]}
                onPress={() => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });

                  if (!event.defaultPrevented) {
                    navigation.dispatch({
                      ...CommonActions.navigate(route.name, route.params),
                      target: state.key,
                    });
                  }
                }}>
                <View style={styles.tabContent}>
                  {descriptors[route.key].options.tabBarIcon?.({
                    focused: state.index === index + middleIndex + 1,
                    color:
                      state.index === index + middleIndex + 1
                        ? Colors.main
                        : '#666',
                    size: 24,
                  })}
                  <Text
                    style={[
                      styles.tabLabel,
                      state.index === index + middleIndex + 1 && styles.activeTabLabel,
                    ]}>
                    {route.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  },
);

const PartnerBottomTabs = memo(() => (
  <Tab.Navigator
    initialRouteName="Property"
    screenOptions={{
      headerShown: false,
      tabBarHideOnKeyboard: true,
    }}
    // eslint-disable-next-line react/no-unstable-nested-components
    tabBar={props => <CustomBottomBar {...props} />}>
    {tabScreens.map(({name, component, icon}) => (
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
      />
    ))}
  </Tab.Navigator>
));

const styles = StyleSheet.create({
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  bottomBar: {
    backgroundColor: 'white',
    borderRadius: 24,
    elevation: 15,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeTabLabel: {
    color: Colors.main,
  },
  tabSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  activeTab: {
    // borderRadius: 16,
    // margin: 2,
  },
  activeTabColor: {
    color: Colors.main + '20', // 20 is opacity
  },
  centerTab: {
    backgroundColor: Colors.main,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  activeCenterTab: {
    backgroundColor: Colors.main,
    transform: [{scale: 1.1}],
  },
});

export default PartnerBottomTabs;
