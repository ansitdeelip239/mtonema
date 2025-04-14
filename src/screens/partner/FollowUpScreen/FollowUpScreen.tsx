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
import {Badge} from 'react-native-paper';

type Props = NativeStackScreenProps<FollowUpStackParamList, 'FollowUpScreen'>;

const FollowUpScreen: React.FC<Props> = ({navigation}) => {
  const {
    followUps: todayFollowUps,
    isLoading: isTodayLoading,
    fetchFollowUps: fetchTodayFollowUps,
  } = useFollowUps('today');

  const {followUps: overdueFollowUps, fetchFollowUps: fetchOverdueFollowUps} =
    useFollowUps('overdue');

  const {followUps: upcomingFollowUps, fetchFollowUps: fetchUpcomingFollowUps} =
    useFollowUps('upcoming');

  const {followUps: somedayFollowUps, fetchFollowUps: fetchSomedayFollowUps} =
    useFollowUps('someday');

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
      <Header<PartnerDrawerParamList> title="Follow-Ups" />

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
                <View style={styles.titleContainer}>
                  <Text style={styles.navButtonTitle}>Overdue Follow-ups</Text>
                  {overdueFollowUps.length > 0 && (
                    <Badge style={styles.overdueBadge} size={22}>
                      {overdueFollowUps.length}
                    </Badge>
                  )}
                </View>
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
                <View style={styles.titleContainer}>
                  <Text style={styles.navButtonTitle}>Upcoming Follow-ups</Text>
                  {upcomingFollowUps.length > 0 && (
                    <Badge style={styles.upcomingBadge} size={22}>
                      {upcomingFollowUps.length}
                    </Badge>
                  )}
                </View>
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
                <View style={styles.titleContainer}>
                  <Text style={styles.navButtonTitle}>Someday Follow-ups</Text>
                  {somedayFollowUps.length > 0 && (
                    <Badge style={styles.somedayBadge} size={22}>
                      {somedayFollowUps.length}
                    </Badge>
                  )}
                </View>
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
          isLoading={isTodayLoading}
          followUps={getTodayFollowUps()}
          emptyText="No follow-ups scheduled for today"
          onFollowUpPress={handleFollowUpPress}
          filterType="today"
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
    backgroundColor: '#fff0f0',
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  overdueIconContainer: {
    backgroundColor: '#e74c3c',
  },
  upcomingIconContainer: {
    backgroundColor: Colors.main,
  },
  somedayButton: {
    backgroundColor: '#f5f5f5',
    borderLeftWidth: 4,
    borderLeftColor: '#95a5a6',
  },
  somedayIconContainer: {
    backgroundColor: '#95a5a6',
  },
  navButtonTextContainer: {
    flex: 1,
  },
  navButtonSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  bottomPadding: {
    height: 100,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  navButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  overdueBadge: {
    backgroundColor: '#e74c3c',
    color: 'white',
  },
  upcomingBadge: {
    backgroundColor: Colors.main,
    color: 'white',
  },
  somedayBadge: {
    backgroundColor: '#95a5a6',
    color: 'white',
  },
});

export default FollowUpScreen;
