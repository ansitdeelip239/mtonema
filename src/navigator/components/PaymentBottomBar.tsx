import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {CommonActions, ParamListBase} from '@react-navigation/native';
import {useKeyboard} from '../../hooks/useKeyboard';
import {IconEnum} from '../../components/GetIcon';
import {useTheme} from '../../context/ThemeProvider';
import {useBottomTab} from '../../context/BottomTabProvider';

export type TabScreen<T extends ParamListBase> = {
  name: keyof T;
  component: React.ComponentType<any>;
  icon: IconEnum;
  label?: string;
  listeners?: (props: {navigation: any}) => Partial<{
    tabPress: () => void;
  }>;
};

interface CustomBottomBarProps<T extends ParamListBase>
  extends BottomTabBarProps {
  tabScreens: Array<TabScreen<T>>;
}

export const PaymentBottomBar = <T extends ParamListBase>({
  navigation,
  state,
  descriptors,
  tabScreens,
}: CustomBottomBarProps<T>) => {
  const {keyboardVisible} = useKeyboard();
  const {theme} = useTheme();
  const {isTabBarHidden} = useBottomTab();

  const shouldHideTabBar = isTabBarHidden || Object.values(descriptors).some(
    descriptor =>
      typeof descriptor.options.tabBarStyle === 'object' &&
      descriptor.options.tabBarStyle !== null &&
      'display' in descriptor.options.tabBarStyle &&
      descriptor.options.tabBarStyle.display === 'none',
  );

  if (keyboardVisible || shouldHideTabBar) {
    return null;
  }

  return (
    <View style={styles.bottomBarContainer}>
      <View style={styles.bottomBar}>
        <View style={styles.tabSection}>
          {tabScreens.map((tab, index) => {
            const route = state.routes[index];
            const focused = state.index === index;
            return (
              <TouchableOpacity
                key={route.key}
                style={[styles.tab, focused && styles.activeTab]}
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
                  {/* Use tab.icon and tab.label directly */}
                  {typeof tab.icon === 'string' ? (
                    descriptors[route.key].options.tabBarIcon?.({
                      focused,
                      color: focused ? theme.primaryColor : '#666',
                      size: 24,
                    })
                  ) : null}
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.tabLabel,
                      focused && styles.activeTabLabel,
                      focused && {color: theme.primaryColor},
                    ]}>
                    {tab.label || route.name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 4 : 16,
    backgroundColor: 'transparent',
  },
  bottomBar: {
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 5,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    minWidth: 80,
    maxWidth: 120,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#444',
    marginTop: 4,
    textAlign: 'center',
    flexShrink: 1,
    flexWrap: 'wrap',
    minWidth: 80,
    maxWidth: 120,
  },
  activeTabLabel: {
    fontWeight: Platform.OS === 'android' ? 'bold' : '400',
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
  centerTab: {
    // width: 48,
    // height: 48,
    // borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    elevation: 5,
    height: 50,
    width: 50,
  },
  activeCenterTab: {
    transform: [{scale: 1.1}],
  },
});
