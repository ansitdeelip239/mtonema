import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FollowUpStackParamList} from '../../../navigator/components/FollowUpScreenStack';
import Header from '../../../components/Header';
import {Card} from 'react-native-paper';
import GetIcon from '../../../components/GetIcon';
import Colors from '../../../constants/Colors';
import PartnerService from '../../../services/PartnerService';
import {FollowUpType} from '../../../types';
import {formatFollowUpDate, formatTime} from '../../../utils/dateUtils';

type Props = NativeStackScreenProps<
  FollowUpStackParamList,
  'OverdueFollowUpScreen'
>;

const OverdueFollowUpScreen: React.FC<Props> = ({navigation}) => {
  const [followUps, setFollowUps] = useState<FollowUpType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

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

  // Common function for fetching follow-ups - using 'someday' as parameter
  const fetchData = useCallback(async (isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    }

    setIsLoading(true);
    try {
      const response = await PartnerService.getFollowUpByUserId(101, 'someday');
      if (response.success && response.data) {
        setFollowUps(response.data);
      }
    } catch (error) {
      console.error(
        `Error ${isRefreshing ? 'refreshing' : 'fetching'} someday follow-ups:`,
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

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Someday Follow-ups"
        backButton={true}
        navigation={navigation}
      />

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
        {/* Someday Follow-ups Section */}
        <View style={styles.sectionContainer}>
          {/* <View style={styles.sectionTitleContainer}>
            <GetIcon iconName="calendarSomeday" size={22} />
            <Text style={styles.sectionTitle}>Someday Follow-ups</Text>
          </View> */}

          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={Colors.main} />
              <Text style={styles.loaderText}>Loading follow-ups...</Text>
            </View>
          ) : followUps && followUps.length > 0 ? (
            <FlatList
              data={followUps}
              renderItem={renderFollowUpItem}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <GetIcon iconName="about" size={24} />
              <Text style={styles.emptyText}>
                No someday follow-ups scheduled
              </Text>
            </View>
          )}
        </View>

        {/* Increase bottom padding to prevent content from being hidden under bottom navigation */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
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
    color: Colors.textLight || '#999',
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

export default OverdueFollowUpScreen;
