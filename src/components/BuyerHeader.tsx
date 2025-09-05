import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Platform} from 'react-native';
import GetIcon from './GetIcon';
import {useDrawer} from '../hooks/useDrawer';

interface BuyerHeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  onActionPress?: () => void;
}

const BuyerHeader: React.FC<BuyerHeaderProps> = ({
  title = 'Welcome back',
  subtitle,
  children,
  onActionPress,
}) => {
  const {openDrawer} = useDrawer();

  return (
    <View style={styles.header}>
      {/* Top row with drawer button on left and action button on right */}
      <View style={styles.headerTop}>
        <TouchableOpacity
          onPress={openDrawer}
          style={styles.drawerButton}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <GetIcon iconName="hamburgerMenu" size={20} color="#333" />
        </TouchableOpacity>

        <View style={styles.spacer} />

        {children && (
          <TouchableOpacity
            onPress={onActionPress}
            style={styles.actionButton}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            {children}
          </TouchableOpacity>
        )}
      </View>

      {/* Content below the top row */}
      <View style={styles.headerContent}>
        <Text style={styles.welcomeText}>{title}</Text>
        {subtitle && <Text style={styles.headerTitle}>{subtitle}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  spacer: {
    flex: 1,
  },
  drawerButton: {
    padding: 0,
    borderRadius: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default BuyerHeader;
