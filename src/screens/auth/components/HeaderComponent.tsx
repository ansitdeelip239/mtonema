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
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  title,
  onBackPress,
  showBackButton = true,
  rightComponent,
  gradientColors = [Colors.MT_PRIMARY_1, '#1e5799'],
}) => {
  // Get safe area insets
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar backgroundColor={gradientColors[0]} barStyle="light-content" />
      <LinearGradient
        colors={gradientColors}
        style={[
          styles.headerGradient,
          {
            paddingTop:
              insets.top > 0 ? insets.top : Platform.OS === 'ios' ? 50 : 30,
          },
        ]}>
        <View style={styles.headerContent}>
          {showBackButton ? (
            <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
              <GetIcon iconName="back" color="white" size="24" />
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
    // paddingTop handled dynamically with insets
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    width: 40,
  },
});

export default HeaderComponent;
