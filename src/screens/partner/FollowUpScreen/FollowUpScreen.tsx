import React, {useEffect, useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  NativeScrollEvent,
  NativeSyntheticEvent,
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
import {useTheme} from '../../../context/ThemeProvider';
import SalutationGreeting from './components/Salutation';

type Props = NativeStackScreenProps<FollowUpStackParamList, 'FollowUpScreen'>;

const FollowUpScreen: React.FC<Props> = ({navigation}) => {
  const {theme} = useTheme();

  const {
    followUps: todayFollowUps,
    isLoading: isTodayLoading,
    fetchFollowUps: fetchTodayFollowUps,
    loadMoreFollowUps: loadMoreTodayFollowUps,
    isLoadingMore: isLoadingMoreToday,
    hasMoreData: hasMoreTodayData,
  } = useFollowUps('today');

  const {
    followUps: overdueFollowUps,
    fetchFollowUps: fetchOverdueFollowUps,
    pagination: overduePagination,
  } = useFollowUps('overdue', 1);

  const {
    followUps: upcomingFollowUps,
    fetchFollowUps: fetchUpcomingFollowUps,
    pagination: upcomingPagination,
  } = useFollowUps('upcoming', 1);

  const {
    followUps: somedayFollowUps,
    fetchFollowUps: fetchSomedayFollowUps,
    pagination: somedayPagination,
  } = useFollowUps('someday', 1);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const {clientsUpdated} = usePartner();
  const [activeSection, setActiveSection] = useState<string | null>(null);

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

  const getTodayFollowUps = useCallback(() => {
    if (!todayFollowUps) {
      return [];
    }
    return todayFollowUps.filter(followUp => isToday(followUp.followUpDate));
  }, [todayFollowUps, isToday]);

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

  const navigateToScreen = (screenType: string) => {
    if (screenType === 'overdue') {
      navigation.navigate('OverdueFollowUpScreen');
    } else if (screenType === 'upcoming') {
      navigation.navigate('UpcomingFollowUpScreen');
    } else if (screenType === 'someday') {
      navigation.navigate('SomedayFollowUpScreen');
    }
  };

  const handleFollowUpPress = (clientId: number) => {
    navigate('Clients', {
      screen: 'ClientProfileScreen',
      params: {clientId},
    });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    const paddingToBottom = 20;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

    if (isCloseToBottom && activeSection === 'today' && hasMoreTodayData) {
      loadMoreTodayFollowUps();
    }
  };

  const setCurrentSection = (section: string) => {
    setActiveSection(section);
  };

  return (
    <>
      <Header<PartnerDrawerParamList> title="Follow-Ups" />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[theme.primaryColor]}
            tintColor={theme.primaryColor}
          />
        }
        onScroll={handleScroll}
        scrollEventThrottle={400}>
        {/* Salutation - Now inside ScrollView */}
        <SalutationGreeting />

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
                  {backgroundColor: Colors.red},
                ]}>
                <GetIcon iconName="calendarOverdue" size={24} />
              </View>
              <View style={styles.navButtonTextContainer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.navButtonTitle}>Overdue Follow-ups</Text>
                  {overdueFollowUps.length > 0 && (
                    <Badge style={styles.overdueBadge} size={22}>
                      {overduePagination?.totalCount}
                    </Badge>
                  )}
                </View>
                <Text style={styles.navButtonSubtitle}>
                  Follow-ups that have passed their due date
                </Text>
              </View>
              <GetIcon
                iconName="chevronRight"
                size={24}
                color={Colors.MT_SECONDARY_2}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigateToScreen('upcoming')}>
            <View style={styles.navButtonContent}>
              <View
                style={[
                  styles.navButtonIconContainer,
                  {backgroundColor: theme.primaryColor},
                ]}>
                <GetIcon iconName="calendarUpcoming" size={24} />
              </View>
              <View style={styles.navButtonTextContainer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.navButtonTitle}>Upcoming Follow-ups</Text>
                  {upcomingFollowUps.length > 0 && (
                    <Badge
                      style={{
                        backgroundColor: theme.primaryColor,
                        color: theme.backgroundColor,
                      }}
                      size={22}>
                      {upcomingPagination?.totalCount}
                    </Badge>
                  )}
                </View>
                <Text style={styles.navButtonSubtitle}>
                  Follow-ups scheduled for the next 7 days
                </Text>
              </View>
              <GetIcon
                iconName="chevronRight"
                size={24}
                color={Colors.MT_SECONDARY_2}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              styles.somedayButton,
              {borderLeftColor: theme.secondaryColor},
            ]}
            onPress={() => navigateToScreen('someday')}>
            <View style={styles.navButtonContent}>
              <View
                style={[
                  styles.navButtonIconContainer,
                  {backgroundColor: theme.secondaryColor},
                ]}>
                <GetIcon iconName="calendarSomeday" size={24} />
              </View>
              <View style={styles.navButtonTextContainer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.navButtonTitle}>Someday Follow-ups</Text>
                  {somedayFollowUps.length > 0 && (
                    <Badge
                      style={[
                        styles.somedayBadge,
                        {backgroundColor: theme.secondaryColor},
                      ]}
                      size={22}>
                      {somedayPagination?.totalCount}
                    </Badge>
                  )}
                </View>
                <Text style={styles.navButtonSubtitle}>
                  Follow-ups scheduled for later dates
                </Text>
              </View>
              <GetIcon
                iconName="chevronRight"
                size={24}
                color={Colors.MT_SECONDARY_2}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Today's Follow-ups Section */}
        <View
          onLayout={() => setCurrentSection('today')}
          style={styles.sectionContainer}>
          <FollowUpListSection
            title="Today's Follow-ups"
            iconName="calendarToday"
            isLoading={isTodayLoading}
            followUps={getTodayFollowUps()}
            emptyText="No follow-ups scheduled for today"
            onFollowUpPress={handleFollowUpPress}
            filterType="today"
            onEndReached={() => {
              if (hasMoreTodayData) {
                loadMoreTodayFollowUps();
              }
            }}
            isLoadingMore={isLoadingMoreToday}
          />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  navButtonsContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  navButton: {
    backgroundColor: Colors.MT_SECONDARY_3,
    borderRadius: 12,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  overdueButton: {
    backgroundColor: '#f8f1f1',
    borderLeftWidth: 4,
    borderLeftColor: '#c33140',
  },
  overdueIconContainer: {
    backgroundColor: '#c33140',
  },
  somedayButton: {
    backgroundColor: '#f5f7f7',
    borderLeftWidth: 4,
  },
  navButtonTextContainer: {
    flex: 1,
  },
  navButtonSubtitle: {
    fontSize: 14,
    color: Colors.MT_SECONDARY_2,
  },
  sectionContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  navButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.MT_SECONDARY_1,
    marginRight: 8,
  },
  overdueBadge: {
    backgroundColor: '#c33140',
    color: Colors.MT_SECONDARY_3,
  },
  somedayBadge: {
    color: Colors.MT_SECONDARY_3,
  },
  loadingMoreContainer: {
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loadingMoreText: {
    marginLeft: 8,
    color: Colors.MT_SECONDARY_2,
    fontSize: 14,
  },
});

export default FollowUpScreen;
