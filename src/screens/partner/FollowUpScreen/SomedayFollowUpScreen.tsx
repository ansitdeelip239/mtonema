import React, {useEffect, useState} from 'react';
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
import {useFollowUps} from '../../../hooks/useFollowUps';
import FollowUpListSection from './components/FollowUpListSection';
import {navigate} from '../../../navigator/NavigationRef';
import {FollowUpType} from '../../../types';
import { useTheme } from '../../../context/ThemeProvider';

type Props = NativeStackScreenProps<
  FollowUpStackParamList,
  'SomedayFollowUpScreen'
>;

const SomedayFollowUpScreen: React.FC<Props> = ({navigation, route}) => {
  // Get initial follow-ups from route params
  const initialFollowUps = route.params?.followUps || [];
  const [displayedFollowUps, setDisplayedFollowUps] =
    useState<FollowUpType[]>(initialFollowUps);

  // Hook for refresh functionality only
  const {followUps, isLoading, refreshing, onRefresh} =
    useFollowUps('someday');

  const {theme} = useTheme();

  const handleFollowUpPress = (clientId: number) => {
    navigate('Clients', {
      screen: 'ClientProfileScreen',
      params: {clientId},
    });
  };

  // Remove initial data fetch - we don't need it anymore

  // Update displayed follow-ups when hook data updates after a refresh
  useEffect(() => {
    if (followUps && followUps.length > 0) {
      setDisplayedFollowUps(followUps);
    }
  }, [followUps]);

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
            colors={[theme.primaryColor]}
            tintColor={theme.primaryColor}
          />
        }>
        <FollowUpListSection
          isLoading={isLoading && displayedFollowUps.length === 0}
          followUps={displayedFollowUps}
          emptyText="No someday follow-ups scheduled"
          showTitle={false}
          onFollowUpPress={handleFollowUpPress}
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

export default SomedayFollowUpScreen;
