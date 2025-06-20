import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  StatusBar,
} from 'react-native';
import GetIcon from './GetIcon';
import {useDrawer} from '../hooks/useDrawer';
import {ParamListBase} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '../context/ThemeProvider';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getGradientColors} from '../utils/colorUtils';

interface HeaderProps {
  title: string;
  children?: React.ReactNode;
  backButton?: boolean;
  navigation?: NativeStackNavigationProp<any>;
  onBackPress?: () => void;
  titleSize?: number;
  hideDrawerButton?: boolean;
  centerTitle?: boolean;
  gradientColors?: string[];
  compact?: boolean;
  showFilterButton?: boolean;
  onFilterPress?: () => void;
}

export default function Header<T extends ParamListBase>({
  title,
  children,
  backButton,
  navigation,
  onBackPress,
  titleSize = 18,
  hideDrawerButton = false,
  centerTitle = false,
  gradientColors,
  compact = false,
  showFilterButton = false,
  onFilterPress,
}: HeaderProps) {
  const {openDrawer} = useDrawer<T>();
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();

  // Get safe area insets
  const topPadding =
    insets.top > 0 ? insets.top : Platform.OS === 'ios' ? 20 : 8;

  // Smaller bottom padding like HeaderComponent
  const bottomPadding = compact ? 8 : 10;

  // Use provided gradientColors or fallback to calculated ones
  const headerColors = gradientColors || getGradientColors(theme.primaryColor);

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation) {
      navigation.goBack();
    }
  };

  return (
    <>
      <StatusBar backgroundColor={headerColors[0]} barStyle="light-content" />
      <LinearGradient
        colors={headerColors}
        style={[
          styles.headerGradient,
          {
            paddingTop: topPadding,
            paddingBottom: bottomPadding,
          },
        ]}>
        <View style={styles.headerContainer}>
          {!hideDrawerButton && (
            <TouchableOpacity
              onPress={backButton ? () => handleBackPress() : openDrawer}
              style={styles.menuButton}>
              <GetIcon
                iconName={backButton ? 'back' : 'hamburgerMenu'}
                color="white"
                size="20"
              />
            </TouchableOpacity>
          )}
          <Text
            style={[
              styles.headerText,
              {fontSize: titleSize},
              hideDrawerButton ? styles.noPaddingLeft : {},
              centerTitle ? styles.centeredTitle : {},
            ]}>
            {title}
          </Text>
          <View style={styles.rightSection}>
            {showFilterButton && (
              <TouchableOpacity
                onPress={onFilterPress}
                style={styles.filterButton}>
                <GetIcon iconName="filterFunnel" color="white" size="20" />
              </TouchableOpacity>
            )}
            <View style={styles.child}>{children}</View>
          </View>
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 40,
  },
  headerText: {
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    paddingLeft: 16,
  },
  centeredTitle: {
    textAlign: 'center',
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  child: {
    marginRight: 8,
  },
  noPaddingLeft: {
    paddingLeft: 0,
  },
});
