import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FollowUpStackParamList} from '../../../navigator/components/FollowUpScreenStack';
import Header from '../../../components/Header';
import {useFollowUps} from '../../../hooks/useFollowUps';
import FollowUpListSection from './components/FollowUpListSection';
import {navigate} from '../../../navigator/components/NavigationRef';
import {useTheme} from '../../../context/ThemeProvider';
import {useTranslation} from 'react-i18next'; // ADD THIS

type Props = NativeStackScreenProps<
  FollowUpStackParamList,
  'OverdueFollowUpScreen'
>;

const OverdueFollowUpScreen: React.FC<Props> = ({navigation}) => {
  const {t} = useTranslation();

  const {
    followUps,
    isLoading,
    refreshing,
    onRefresh,
    loadMoreFollowUps,
    isLoadingMore,
    hasMoreData,
    fetchFollowUps,
  } = useFollowUps('overdue');

  const {theme} = useTheme();

  useEffect(() => {
    fetchFollowUps();
  }, [fetchFollowUps]);

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

    if (isCloseToBottom && hasMoreData && !isLoadingMore) {
      loadMoreFollowUps();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === 'android' && (
        <Header
          title={t('followUp.overdue.title', 'Overdue Follow-Ups')}
          backButton={true}
          navigation={navigation}
        />
      )}

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primaryColor]}
            tintColor={theme.primaryColor}
          />
        }
        onScroll={handleScroll}
        scrollEventThrottle={400}>
        <FollowUpListSection
          isLoading={isLoading}
          followUps={followUps || []}
          emptyText={t('followUp.overdue.empty', 'No overdue follow-ups')}
          showTitle={false}
          onFollowUpPress={handleFollowUpPress}
          onEndReached={() => {
            if (hasMoreData) {
              loadMoreFollowUps();
            }
          }}
          isLoadingMore={isLoadingMore}
        />

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
  bottomPadding: {
    height: 100,
  },
});

export default OverdueFollowUpScreen;
