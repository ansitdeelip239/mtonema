import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import {
  PanGestureHandler,
  GestureHandlerRootView,
  State,
} from 'react-native-gesture-handler';
import GetIcon from '../../../../components/GetIcon';
import {useTheme} from '../../../../context/ThemeProvider';

interface FilterDrawerProps {
  visible: boolean;
  onClose: () => void;
  sortBy: 'createdOn' | 'activity';
  sortDirection: 'asc' | 'desc';
  onFilterChange: (
    sortBy: 'createdOn' | 'activity',
    sortDirection: 'asc' | 'desc',
  ) => void;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  visible,
  onClose,
  sortBy,
  sortDirection,
  onFilterChange,
}) => {
  const {theme} = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(500)).current;
  const gestureTranslateY = useRef(new Animated.Value(0)).current;
  const [isClosing, setIsClosing] = useState(false);

  // Local state for temporary filter values
  const [tempSortBy, setTempSortBy] = useState<'createdOn' | 'activity'>(
    sortBy,
  );
  const [tempSortDirection, setTempSortDirection] = useState<'asc' | 'desc'>(
    sortDirection,
  );

  useEffect(() => {
    if (visible && !isClosing) {
      // Reset temp values to current values when drawer opens
      setTempSortBy(sortBy);
      setTempSortDirection(sortDirection);

      gestureTranslateY.setValue(0);
      setIsClosing(false);

      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (!visible && !isClosing) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 500,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [
    visible,
    fadeAnim,
    slideAnim,
    isClosing,
    gestureTranslateY,
    sortBy,
    sortDirection,
  ]);

  const handleFilterSelect = (newSortBy: 'createdOn' | 'activity') => {
    setTempSortBy(newSortBy);
  };

  const handleDirectionToggle = () => {
    const newDirection = tempSortDirection === 'asc' ? 'desc' : 'asc';
    setTempSortDirection(newDirection);
  };

  const handleApply = () => {
    onFilterChange(tempSortBy, tempSortDirection);
    handleClose();
  };

  const handleCancel = () => {
    // Reset temp values to original values
    setTempSortBy(sortBy);
    setTempSortDirection(sortDirection);
    handleClose();
  };

  const handleClose = () => {
    if (isClosing) {
      return;
    }

    setIsClosing(true);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 500,
        duration: 250,
        useNativeDriver: true,
      }),
      // Reset gesture translation
      Animated.timing(gestureTranslateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsClosing(false);
      onClose();
    });
  };

  const onGestureEvent = Animated.event(
    [{nativeEvent: {translationY: gestureTranslateY}}],
    {useNativeDriver: true},
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const {translationY, velocityY} = event.nativeEvent;

      // Close if dragged down more than 100px or with sufficient velocity
      const shouldClose = translationY > 100 || velocityY > 1000;

      if (shouldClose) {
        handleCancel();
      } else {
        Animated.spring(gestureTranslateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
      }
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleCancel}>
      <GestureHandlerRootView style={drawerStyles.overlay}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: fadeAnim,
            },
          ]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            onPress={handleCancel}
          />
        </Animated.View>

        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
          minPointers={1}
          maxPointers={1}>
          <Animated.View
            style={[
              drawerStyles.drawer,
              {
                transform: [
                  {translateY: slideAnim},
                  {
                    translateY: gestureTranslateY.interpolate({
                      inputRange: [-10, 0, 500],
                      outputRange: [0, 0, 500],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}>
            <View style={drawerStyles.handle} />

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Sort & Filter</Text>
              <TouchableOpacity
                onPress={handleCancel}
                style={styles.closeButton}>
                <GetIcon iconName="clear" color="#666" size={24} />
              </TouchableOpacity>
            </View>

            {/* Sort Direction */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sort Direction</Text>
              <TouchableOpacity
                style={[
                  styles.directionButton,
                  {backgroundColor: theme.primaryColor},
                ]}
                onPress={handleDirectionToggle}>
                <GetIcon
                  iconName={
                    tempSortDirection === 'asc' ? 'ascending' : 'descending'
                  }
                  color="#fff"
                  size={20}
                />
                <Text style={styles.directionText}>
                  {tempSortDirection === 'asc' ? 'Ascending' : 'Descending'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sort By Options */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sort By</Text>

              <TouchableOpacity
                style={[
                  styles.filterOption,
                  tempSortBy === 'createdOn' && {
                    backgroundColor: theme.primaryColor + '20',
                    borderColor: theme.primaryColor,
                  },
                ]}
                onPress={() => handleFilterSelect('createdOn')}>
                <View style={styles.optionContent}>
                  <GetIcon
                    iconName="calendar"
                    color={theme.primaryColor}
                    size={20}
                  />
                  <View style={styles.optionText}>
                    <Text style={styles.optionTitle}>Created Date</Text>
                    <Text style={styles.optionSubtitle}>
                      Sort by when client was added
                    </Text>
                  </View>
                </View>
                {tempSortBy === 'createdOn' && (
                  <GetIcon
                    iconName="checkmark"
                    color={theme.primaryColor}
                    size={20}
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterOption,
                  tempSortBy === 'activity' && {
                    backgroundColor: theme.primaryColor + '20',
                    borderColor: theme.primaryColor,
                  },
                ]}
                onPress={() => handleFilterSelect('activity')}>
                <View style={styles.optionContent}>
                  <GetIcon
                    iconName="compass"
                    color={theme.primaryColor}
                    size={20}
                  />
                  <View style={styles.optionText}>
                    <Text style={styles.optionTitle}>Last Activity Date</Text>
                    <Text style={styles.optionSubtitle}>
                      Sort by most recent activity
                    </Text>
                  </View>
                </View>
                {tempSortBy === 'activity' && (
                  <GetIcon
                    iconName="checkmark"
                    color={theme.primaryColor}
                    size={20}
                  />
                )}
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.applyButton,
                  {backgroundColor: theme.primaryColor},
                ]}
                onPress={handleApply}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </PanGestureHandler>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  directionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  directionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
    backgroundColor: 'white',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionText: {
    marginLeft: 12,
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  applyButton: {
    // backgroundColor will be set dynamically using theme.primaryColor
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
});

const drawerStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  drawer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  handle: {
    width: 50,
    height: 5,
    backgroundColor: '#D0D0D0',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
});

export default FilterDrawer;
