import React, {useEffect, useCallback, useState} from 'react';
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
import {usePartner} from '../../../context/PartnerProvider';
import {navigate} from '../../../navigator/NavigationRef';

type Props = NativeStackScreenProps<FollowUpStackParamList, 'FollowUpScreen'>;

const FollowUpScreen: React.FC<Props> = ({navigation}) => {
  const {
    followUps: todayFollowUps,
    isLoading: isTodayLoading,
    fetchFollowUps: fetchTodayFollowUps,
  } = useFollowUps('today');

  const {
    followUps: overdueFollowUps,
    fetchFollowUps: fetchOverdueFollowUps,
  } = useFollowUps('overdue');

  const {
    followUps: upcomingFollowUps,
    fetchFollowUps: fetchUpcomingFollowUps,
  } = useFollowUps('upcoming');

  const {
    followUps: somedayFollowUps,
    fetchFollowUps: fetchSomedayFollowUps,
  } = useFollowUps('someday');

  const [isRefreshing, setIsRefreshing] = useState(false);
  const {clientsUpdated} = usePartner();

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
    if (!todayFollowUps) {
      return [];
    }
    return todayFollowUps.filter(followUp => isToday(followUp.followUpDate));
  }, [todayFollowUps, isToday]);

  // Update useEffect to fetch all follow-ups
  useEffect(() => {
    fetchTodayFollowUps();
    fetchOverdueFollowUps();
    fetchUpcomingFollowUps();
    fetchSomedayFollowUps();
  }, [
    fetchTodayFollowUps,
    fetchOverdueFollowUps,
    fetchUpcomingFollowUps,
    fetchSomedayFollowUps,
    clientsUpdated,
  ]);

  // Create a new combined refresh handler
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchTodayFollowUps(),
        fetchOverdueFollowUps(),
        fetchUpcomingFollowUps(),
        fetchSomedayFollowUps(),
      ]);
    } catch (error) {
      console.error('Error refreshing follow-ups:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [
    fetchTodayFollowUps,
    fetchOverdueFollowUps,
    fetchUpcomingFollowUps,
    fetchSomedayFollowUps,
  ]);

  // Navigate to different screens based on button pressed
  const navigateToScreen = (screenType: string) => {
    if (screenType === 'overdue') {
      navigation.navigate('OverdueFollowUpScreen', {
        followUps: overdueFollowUps,
      });
    } else if (screenType === 'upcoming') {
      navigation.navigate('UpcomingFollowUpScreen', {
        followUps: upcomingFollowUps,
      });
    } else if (screenType === 'someday') {
      navigation.navigate('SomedayFollowUpScreen', {
        followUps: somedayFollowUps,
      });
    }
  };

  const handleFollowUpPress = (clientId: number) => {
    navigate('Clients', {
      screen: 'ClientProfileScreen',
      params: {clientId},
    });
  };

  return (
    <View style={styles.container}>
      <Header<PartnerDrawerParamList> title="Follow-ups" />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
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
              <View style={styles.countContainer}>
                <Text style={[styles.count, styles.overdueCount]}>
                  {overdueFollowUps.length}
                </Text>
                <GetIcon iconName="chevronRight" size={24} color="#666" />
              </View>
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
              <View style={styles.countContainer}>
                <Text style={[styles.count, styles.upcomingCount]}>
                  {upcomingFollowUps.length}
                </Text>
                <GetIcon iconName="chevronRight" size={24} color="#666" />
              </View>
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
              <View style={styles.countContainer}>
                <Text style={[styles.count, styles.somedayCount]}>
                  {somedayFollowUps.length}
                </Text>
                <GetIcon iconName="chevronRight" size={24} color="#666" />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Today's Follow-ups Section */}
        <FollowUpListSection
          title="Today's Follow-ups"
          iconName="calendarToday"
          isLoading={isTodayLoading}
          followUps={getTodayFollowUps()}
          emptyText="No follow-ups scheduled for today"
          onFollowUpPress={handleFollowUpPress}
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
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  count: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 28,
    textAlign: 'center',
  },
  overdueCount: {
    backgroundColor: '#ffe5e5',
    color: '#e74c3c',
  },
  upcomingCount: {
    backgroundColor: Colors.main + '20',
    color: Colors.main,
  },
  somedayCount: {
    backgroundColor: '#ecf0f1',
    color: '#95a5a6',
  },
});

export default FollowUpScreen;
