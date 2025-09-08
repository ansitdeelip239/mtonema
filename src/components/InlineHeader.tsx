import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Platform} from 'react-native';
import GetIcon from './GetIcon';
import {useDrawer} from '../hooks/useDrawer';

interface InlineHeaderProps {
  title?: string;
  children?: React.ReactNode;
  onActionPress?: () => void;
  backButton?: boolean;
  onBackPress?: () => void;
}

const InlineHeader: React.FC<InlineHeaderProps> = ({
  title = 'Welcome back',
  children,
  onActionPress,
  backButton = false,
  onBackPress,
}) => {
  const {openDrawer} = useDrawer();

  const handleLeftPress = () => {
    if (backButton && onBackPress) {
      onBackPress();
    } else {
      openDrawer();
    }
  };

  const leftIconName = backButton ? 'back' : 'hamburgerMenu';

  return (
    <View style={styles.header}>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={handleLeftPress}
          style={styles.drawerButton}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <GetIcon iconName={leftIconName} size={20} color="#333" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>

        {children && (
          <TouchableOpacity
            onPress={onActionPress}
            style={styles.actionButton}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            {children}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    // paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 10,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drawerButton: {
    // padding: 8,
    paddingTop: 4,
    borderRadius: 8,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
});

export default InlineHeader;
