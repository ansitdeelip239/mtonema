import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FollowUpStackParamList} from '../../../navigator/components/FollowUpScreenStack';
import Header from '../../../components/Header';
import Colors from '../../../constants/Colors';
import {useFollowUps} from '../../../hooks/useFollowUps';
import FollowUpListSection from './components/FollowUpListSection';

type Props = NativeStackScreenProps<
  FollowUpStackParamList,
  'OverdueFollowUpScreen'
>;

const OverdueFollowUpScreen: React.FC<Props> = ({navigation}) => {
  const {followUps, isLoading, refreshing, fetchFollowUps, onRefresh} =
    useFollowUps('overdue');

  useEffect(() => {
    fetchFollowUps();
  }, [fetchFollowUps]);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Overdue Follow-ups"
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
        <FollowUpListSection
          isLoading={isLoading}
          followUps={followUps}
          emptyText="No overdue follow-ups"
          showTitle={false}
        />

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
  bottomPadding: {
    height: 100,
  },
});

export default OverdueFollowUpScreen;
