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
        // Remove explicit start/end to match HeaderComponent's behavior
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
                size="20" // Changed from 24 to match HeaderComponent
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
          <View style={styles.child}>{children}</View>
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    // Update to match HeaderComponent
    borderBottomLeftRadius: 25, // Changed from 30 to match HeaderComponent
    borderBottomRightRadius: 25,
    marginBottom: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Added to match HeaderComponent
    paddingHorizontal: 16,
    height: 40, // Match HeaderComponent height
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
    width: 36, // Changed from 40 to match HeaderComponent
    height: 36, // Changed from 40 to match HeaderComponent
    borderRadius: 18,
    // backgroundColor: 'rgba(255,255,255,0.2)', // Added background like HeaderComponent
    justifyContent: 'center',
    alignItems: 'center',
  },
  child: {
    marginRight: 8,
  },
  noPaddingLeft: {
    paddingLeft: 0,
  },
});
