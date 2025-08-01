import React, {ReactNode} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import Colors from '../../../constants/Colors';
import GetIcon from '../../../components/GetIcon';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface HeaderComponentProps {
  title: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
  rightComponent?: ReactNode;
  backgroundColor?: string;
  compact?: boolean;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  title,
  onBackPress,
  showBackButton = false,
  rightComponent,
  backgroundColor = Colors.MT_PRIMARY_1,
  compact = false,
}) => {
  const insets = useSafeAreaInsets();
  const isIOS = Platform.OS === 'ios';

  const topPadding = isIOS
    ? insets.top + 10 // Increased padding for iOS to account for status bar and notch
    : insets.top > 0
    ? insets.top
    : 10;

  const bottomPadding = isIOS
    ? compact
      ? 12
      : 16 // Slightly adjusted for iOS compact mode
    : compact
    ? 8
    : 12;

  return (
    <>
      <StatusBar backgroundColor={backgroundColor} barStyle="light-content" />
      <View
        style={[
          isIOS ? styles.headerIOS : styles.header,
          {
            backgroundColor: backgroundColor,
            paddingTop: topPadding,
            paddingBottom: bottomPadding,
          },
        ]}>
        <View style={isIOS ? styles.headerContentIOS : styles.headerContent}>
          {showBackButton ? (
            <TouchableOpacity
              style={isIOS ? styles.backButtonIOS : styles.backButton}
              onPress={onBackPress}
              accessibilityLabel="Go back"
              accessibilityRole="button">
              <GetIcon iconName="back" color="white" size={20} />
            </TouchableOpacity>
          ) : (
            <View style={isIOS ? styles.spacerIOS : styles.spacer} />
          )}
          <Text
            style={isIOS ? styles.headerTextIOS : styles.headerText}
            numberOfLines={1}
            ellipsizeMode="tail">
            {title}
          </Text>
          {rightComponent || (
            <View style={isIOS ? styles.spacerIOS : styles.spacer} />
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 44,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    width: 36,
  },
  headerIOS: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  headerContentIOS: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 44,
  },
  headerTextIOS: {
    fontSize: 19,
    fontWeight: '600',
    color: 'white',
    letterSpacing: -0.2,
    flex: 1,
    textAlign: 'center',
  },
  backButtonIOS: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacerIOS: {
    width: 40,
  },
});

export default HeaderComponent;
