import React, {memo} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {CommonActions} from '@react-navigation/native';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import GetIcon from '../../components/GetIcon';
import Colors from '../../constants/Colors';
import HomeScreen from '../../screens/partner/HomeScreen/HomeScreen';
import ClientScreen from '../../screens/partner/ClientScreen/ClientScreen';
import {BottomTabParamList} from '../../types/navigation';
import AgentPropertyStack from '../AgentPropertyStack';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const tabScreens = [
  {
    name: 'Home',
    component: HomeScreen,
    icon: 'edit',
  },
  {
    name: 'Property',
    component: AgentPropertyStack,
    icon: 'delete',
  },
  {
    name: 'Clients',
    component: ClientScreen,
    icon: 'delete',
  },
  {
    name: 'Test',
    component: ClientScreen,
    icon: 'delete',
  },
] as const;

const CustomBottomBar = memo(
  ({navigation, state, descriptors}: BottomTabBarProps) => {
    const handleAddPress = () => {
      navigation.navigate('Property', {
        screen: 'AddAgentProperty',
      });
    };

    return (
      <View style={styles.bottomBarContainer}>
        <View style={styles.bottomBar}>
          <View style={styles.tabSection}>
            {state.routes.slice(0, 2).map((route, index) => (
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
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.fabContainer}>
            <TouchableOpacity
              style={styles.fabButton}
              onPress={handleAddPress}
              activeOpacity={0.8}>
              <GetIcon iconName="property" color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.tabSection}>
            {state.routes.slice(2).map((route, index) => (
              <TouchableOpacity
                key={route.key}
                style={[
                  styles.tab,
                  state.index === index + 2 && styles.activeTab,
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
                    focused: state.index === index + 2,
                    color: state.index === index + 2 ? Colors.main : '#666',
                    size: 24,
                  })}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  },
);

const BottomTabs = memo(() => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarHideOnKeyboard: true,
    }}
    tabBar={props => <CustomBottomBar {...props} />}>
    {tabScreens.map(({name, component, icon}) => (
      <Tab.Screen
        key={name}
        name={name}
        component={component}
        options={{
          tabBarLabel: name,
          tabBarIcon: () => <GetIcon iconName={icon} color="#000" />,
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
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
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
  fabContainer: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabButton: {
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
  activeTab: {
    backgroundColor: Colors.main + '20', // 20 is opacity
    borderRadius: 16,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BottomTabs;
