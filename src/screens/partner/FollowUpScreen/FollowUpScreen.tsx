import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Colors from '../../../constants/Colors';
import {Card} from 'react-native-paper';
import GetIcon from '../../../components/GetIcon';
import Header from '../../../components/Header';
import {PartnerDrawerParamList} from '../../../types/navigation';
import PartnerService from '../../../services/PartnerService';
import {FollowUpType} from '../../../types';
import {formatFollowUpDate, formatTime} from '../../../utils/dateUtils';

const FollowUpScreen: React.FC = () => {
  const [followUps, setFollowUps] = useState<FollowUpType[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Helper function to determine if a date is today
  const isToday = (dateString: string | null): boolean => {
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
  };

  // Filter follow-ups for today
  const getTodayFollowUps = () => {
    if (!followUps) {
      return [];
    }
    return followUps.filter(followUp => isToday(followUp.followUpDate));
  };

  // Updated to work with the new data structure and display all groups
  const renderFollowUpItem = ({item}: {item: FollowUpType}) => (
    <Card style={styles.followUpCard}>
      <Card.Content>
        <View style={styles.followUpHeader}>
          <View>
            <Text style={styles.clientName}>{item.client.clientName}</Text>
            <View style={styles.groupsContainer}>
              {item.client.groups && item.client.groups.length > 0 ? (
                item.client.groups.map(group => (
                  <View
                    key={group.id}
                    style={[
                      styles.groupTag,
                      {backgroundColor: group.groupColor + '20'},
                      {borderColor: group.groupColor},
                    ]}>
                    <Text style={[styles.groupText, {color: group.groupColor}]}>
                      {group.name}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noGroupText}>No Group</Text>
              )}
            </View>
          </View>
          <View style={styles.timeContainer}>
            {item.followUpDate && (
              <>
                <Text style={styles.followUpDate}>
                  {formatFollowUpDate(new Date(item.followUpDate))}
                </Text>
                <View style={styles.timeWrapper}>
                  <GetIcon iconName="time" size={14} color={Colors.main} />
                  <Text style={styles.followUpTime}>
                    {formatTime(new Date(item.followUpDate))}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
        <Text style={styles.notes}>{item.client.notes || 'No notes'}</Text>
      </Card.Content>
    </Card>
  );

  // Navigate to different screens based on button pressed
  const navigateToScreen = (screenType: string) => {
    // This will be replaced with actual navigation when screens are created
    console.log(`Navigating to ${screenType} follow-ups screen`);
    // Example: navigation.navigate('OverdueFollowUps');
  };

  // Common function for fetching follow-ups
  const fetchData = useCallback(async (isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    }

    setIsLoading(true);
    try {
      const response = await PartnerService.getFollowUpByUserId(101, 'today');
      if (response.success && response.data) {
        setFollowUps(response.data);
      }
    } catch (error) {
      console.error(
        `Error ${isRefreshing ? 'refreshing' : 'fetching'} follow-ups:`,
        error,
      );
    } finally {
      // Reset the appropriate loading state
      if (isRefreshing) {
        setRefreshing(false);
      }

      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  const fetchFollowUps = useCallback(() => {
    fetchData(false);
  }, [fetchData]);

  // Refresh function
  const onRefresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    fetchFollowUps();
  }, [fetchFollowUps]);

  // Rest of the component (return statement) remains the same
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
        <View style={styles.sectionContainer}>
          <View style={styles.sectionTitleContainer}>
            <GetIcon iconName="calendarToday" size={22} />
            <Text style={styles.sectionTitle}>Today's Follow-ups</Text>
          </View>

          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={Colors.main} />
              <Text style={styles.loaderText}>Loading follow-ups...</Text>
            </View>
          ) : followUps && getTodayFollowUps().length > 0 ? (
            <FlatList
              data={getTodayFollowUps()}
              renderItem={renderFollowUpItem}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <GetIcon iconName="about" size={24} />
              <Text style={styles.emptyText}>
                No follow-ups scheduled for today
              </Text>
            </View>
          )}
        </View>

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
  headerContainer: {
    padding: 16,
    backgroundColor: Colors.main,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
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
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  followUpCard: {
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
    backgroundColor: Colors.white,
  },
  followUpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  clientType: {
    fontSize: 14,
    color: '#666',
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  timeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 2,
  },
  followUpDate: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  followUpTime: {
    fontSize: 14,
    color: Colors.main,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  notes: {
    fontSize: 14,
    color: '#444',
    marginTop: 6,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
  bottomPadding: {
    height: 100, // Keeps the larger padding for bottom navigation
  },
  groupsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    marginBottom: 4,
  },
  groupTag: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 4,
    borderWidth: 1,
  },
  groupText: {
    fontSize: 12,
    fontWeight: '500',
  },
  noGroupText: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  loaderContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  loaderText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default FollowUpScreen;
