import React, {ReactNode} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../../constants/Colors';
import GetIcon from '../../../components/GetIcon';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface HeaderComponentProps {
  title: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
  rightComponent?: ReactNode;
  gradientColors?: string[];
  compact?: boolean; // New prop to allow for a more compact header
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  title,
  onBackPress,
  showBackButton = false,
  rightComponent,
  gradientColors = [Colors.MT_PRIMARY_1, Colors.MT_PRIMARY_1],
  compact = false, // Default to false for backward compatibility
}) => {
  // Get safe area insets
  const insets = useSafeAreaInsets();

  // Reduced top padding for all screens
  const topPadding =
    insets.top > 0 ? insets.top : Platform.OS === 'ios' ? 20 : 8;

  // Smaller bottom padding
  const bottomPadding = compact ? 8 : 10;

  return (
    <>
      <StatusBar backgroundColor={gradientColors[0]} barStyle="light-content" />
      <LinearGradient
        colors={gradientColors}
        style={[
          styles.headerGradient,
          {
            paddingTop: topPadding,
            paddingBottom: bottomPadding,
          },
        ]}>
        <View style={styles.headerContent}>
          {showBackButton ? (
            <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
              <GetIcon iconName="back" color="white" size="20" />
            </TouchableOpacity>
          ) : (
            <View style={styles.spacer} />
          )}

          <Text style={styles.headerText}>{title}</Text>

          {rightComponent || <View style={styles.spacer} />}
        </View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    // paddingTop handled dynamically
    // paddingBottom handled dynamically
    borderBottomLeftRadius: 25, // Slightly smaller radius
    borderBottomRightRadius: 25,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, // Reduced from 20
    height: 40, // Reduced from 45
  },
  headerText: {
    fontSize: 18, // Reduced from 20
    fontWeight: 'bold',
    color: 'white',
  },
  backButton: {
    width: 36, // Reduced from 40
    height: 36, // Reduced from 40
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    width: 36, // Match the button width
  },
});

export default HeaderComponent;
