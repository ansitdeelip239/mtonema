import React, {useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Colors from '../../../constants/Colors';
import GetIcon from '../../../components/GetIcon';
import Header from '../../../components/Header';
import {PartnerDrawerParamList} from '../../../types/navigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FollowUpStackParamList} from '../../../navigator/components/FollowUpScreenStack';
import {useFollowUps} from '../../../hooks/useFollowUps';
import FollowUpListSection from './components/FollowUpListSection';
import { usePartner } from '../../../context/PartnerProvider';

type Props = NativeStackScreenProps<FollowUpStackParamList, 'FollowUpScreen'>;

const FollowUpScreen: React.FC<Props> = ({navigation}) => {
  const {followUps, isLoading, refreshing, fetchFollowUps, onRefresh} =
    useFollowUps('today');
  const { clientsUpdated } = usePartner();

  // Helper function to determine if a date is today
  const isToday = useCallback((dateString: string | null): boolean => {
    if (!dateString) {
      return false;
    }
    const date = new Date(dateString);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }, []);

  // Filter follow-ups for today
  const getTodayFollowUps = useCallback(() => {
    if (!followUps) {
      return [];
    }
    return followUps.filter(followUp => isToday(followUp.followUpDate));
  }, [followUps, isToday]);

  // Navigate to different screens based on button pressed
  const navigateToScreen = (screenType: string) => {
    if (screenType === 'overdue') {
      navigation.navigate('OverdueFollowUpScreen');
    } else if (screenType === 'upcoming') {
      navigation.navigate('UpcomingFollowUpScreen');
    } else if (screenType === 'someday') {
      navigation.navigate('SomedayFollowUpScreen');
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, [fetchFollowUps, clientsUpdated]);

  return (
    <View style={styles.container}>
      <Header<PartnerDrawerParamList> title="Follow-ups" />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.main]}
            tintColor={Colors.main}
          />
        }>
        {/* Navigation Buttons */}
        <View style={styles.navButtonsContainer}>
          <TouchableOpacity
            style={[styles.navButton, styles.overdueButton]}
            onPress={() => navigateToScreen('overdue')}>
            <View style={styles.navButtonContent}>
              <View
                style={[
                  styles.navButtonIconContainer,
                  styles.overdueIconContainer,
                ]}>
                <GetIcon iconName="calendarOverdue" size={24} />
              </View>
              <View style={styles.navButtonTextContainer}>
                <Text style={styles.navButtonTitle}>Overdue Follow-ups</Text>
                <Text style={styles.navButtonSubtitle}>
                  Follow-ups that have passed their due date
                </Text>
              </View>
              <GetIcon iconName="chevronRight" size={24} color="#666" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigateToScreen('upcoming')}>
            <View style={styles.navButtonContent}>
              <View
                style={[
                  styles.navButtonIconContainer,
                  styles.upcomingIconContainer,
                ]}>
                <GetIcon iconName="calendarUpcoming" size={24} />
              </View>
              <View style={styles.navButtonTextContainer}>
                <Text style={styles.navButtonTitle}>Upcoming Follow-ups</Text>
                <Text style={styles.navButtonSubtitle}>
                  Follow-ups scheduled for the next 7 days
                </Text>
              </View>
              <GetIcon iconName="chevronRight" size={24} color="#666" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.somedayButton]}
            onPress={() => navigateToScreen('someday')}>
            <View style={styles.navButtonContent}>
              <View
                style={[
                  styles.navButtonIconContainer,
                  styles.somedayIconContainer,
                ]}>
                <GetIcon iconName="calendarSomeday" size={24} />
              </View>
              <View style={styles.navButtonTextContainer}>
                <Text style={styles.navButtonTitle}>Someday Follow-ups</Text>
                <Text style={styles.navButtonSubtitle}>
                  Follow-ups scheduled for later dates
                </Text>
              </View>
              <GetIcon iconName="chevronRight" size={24} color="#666" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Today's Follow-ups Section */}
        <FollowUpListSection
          title="Today's Follow-ups"
          iconName="calendarToday"
          isLoading={isLoading}
          followUps={getTodayFollowUps()}
          emptyText="No follow-ups scheduled for today"
        />

        {/* Increase bottom padding to prevent content from being hidden under bottom navigation */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  navButtonsContainer: {
    marginBottom: 24,
  },
  navButton: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  navButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  navButtonIconContainer: {
    marginRight: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overdueButton: {
    backgroundColor: '#fff0f0', // Light red background
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c', // Red border
  },
  overdueIconContainer: {
    backgroundColor: '#e74c3c', // Red background for icon
  },
  upcomingIconContainer: {
    backgroundColor: Colors.main, // Main app color for upcoming
  },
  somedayButton: {
    backgroundColor: '#f5f5f5', // Light gray background
    borderLeftWidth: 4,
    borderLeftColor: '#95a5a6', // Gray border
  },
  somedayIconContainer: {
    backgroundColor: '#95a5a6', // Gray background for icon
  },
  navButtonTextContainer: {
    flex: 1,
  },
  navButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  navButtonSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  bottomPadding: {
    height: 100, // Keeps the larger padding for bottom navigation
  },
});

export default FollowUpScreen;
