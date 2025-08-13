import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Platform, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import {PartnerDrawerParamList} from '../../../types/navigation';
import PartnerService from '../../../services/PartnerService';
import {useAuth} from '../../../hooks/useAuth';

// Import separated components
import TeamMemberCard from './components/TeamMemberCard';
import LoadingFooter from './components/LoadingFooter';
import EmptyState from './components/EmptyState';
import TeamHeader from './components/TeamHeader';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import GetIcon from '../../../components/GetIcon';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TeamStackParamList} from '../../../navigator/components/TeamStack';
import { usePartner } from '../../../context/PartnerProvider';

const INITIAL_PAGE = 1;
const PAGE_SIZE = 10;

interface TeamMember {
  teamMemberId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  location: string;
  isActive: boolean;
}

type Props = NativeStackScreenProps<TeamStackParamList, 'Teams Screen'>;

const TeamsScreen: React.FC<Props> = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamMemberCount, setTeamMemberCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);
  const [hasMore, setHasMore] = useState(true);
  const {user} = useAuth();
  const {teamUpdated} = usePartner();

  const fetchTeamMembers = React.useCallback(
    async (page: number, isLoadMore = false) => {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        if (user?.id !== undefined && user?.id !== null) {
          const response = await PartnerService.getAllTeamMembers(
            user.id.toString(),
            page,
            PAGE_SIZE,
          );
          setTeamMemberCount(response.data.pagination.totalCount);
          const newMembersRaw = response?.data?.teamMembers || [];
          const newMembers: TeamMember[] = newMembersRaw.map((member: any) => ({
            teamMemberId: member.teamMemberId?.toString() ?? '',
            name: member.name,
            email: member.email,
            phone: member.phone,
            role: member.role,
            location: member.location,
            isActive: member.isActive,
          }));

          if (isLoadMore) {
            setTeamMembers(prev => [...prev, ...newMembers]);
          } else {
            setTeamMembers(newMembers);
          }

          setHasMore(newMembers.length === PAGE_SIZE);
        } else {
          setError('User ID is not available');
        }
      } catch (err) {
        setError('Failed to fetch team members');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [user?.id],
  );

  useEffect(() => {
    fetchTeamMembers(INITIAL_PAGE);
  }, [user?.id, fetchTeamMembers, teamUpdated]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchTeamMembers(nextPage, true);
    }
  };

  const onRefresh = () => {
    setCurrentPage(INITIAL_PAGE);
    setHasMore(true);
    fetchTeamMembers(INITIAL_PAGE);
  };

  const renderItem = useCallback(
    ({item}: {item: TeamMember}) => <TeamMemberCard item={item} />,
    [],
  );

  const keyExtractor = useCallback(
    (item: TeamMember) => item.teamMemberId.toString(),
    [],
  );

  const ListFooterComponent = useMemo(
    () => <LoadingFooter isVisible={loadingMore} />,
    [loadingMore],
  );

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === 'android' && (
        <Header<PartnerDrawerParamList> title="Teams">
          <TouchableOpacity
            onPress={() => navigation.navigate('Add Teams Screen')}
            style={styles.addButton}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <GetIcon iconName="plus" color="#fff" size={18} />
          </TouchableOpacity>
        </Header>
      )}

      <TeamHeader memberCount={teamMemberCount} />

      {loading && !loadingMore ? (
        <LoadingState message="Loading team members..." />
      ) : (
        <FlatList
          data={teamMembers}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.listContentContainer}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={ListFooterComponent}
          ListEmptyComponent={
            error ? (
              <ErrorState message={error} />
            ) : (
              <EmptyState message="No team members found." />
            )
          }
          refreshing={loading}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={10}
          windowSize={10}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  listContentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  addButton: {
    marginLeft: 16,
    padding: 4,
  },
});

export default TeamsScreen;
