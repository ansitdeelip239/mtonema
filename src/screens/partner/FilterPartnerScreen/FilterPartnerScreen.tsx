import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import Header from '../../../components/Header';
import { useTheme } from '../../../context/ThemeProvider';
import { getGradientColors } from '../../../utils/colorUtils';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { PartnerDrawerParamList } from '../../../types/navigation';
import GetIcon from '../../../components/GetIcon';
import { useAuth } from '../../../hooks/useAuth';
import Roles from '../../../constants/Roles';
import PartnerService from '../../../services/PartnerService';
import { User } from '../../../types';
import { usePartner } from '../../../context/PartnerProvider';
import Toast from 'react-native-toast-message';

const FilterPartnerScreen = () => {
  const { theme } = useTheme();
  const navigation =
    useNavigation<DrawerNavigationProp<PartnerDrawerParamList>>();
  const { user } = useAuth();
  const { selectedPartnerIds, setSelectedPartnerIds, setClientsUpdated } =
    usePartner();

  const [partners, setPartners] = useState<User[]>([]);
  const [selectedPartners, setSelectedPartners] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  // Initialize selected partners from context
  useEffect(() => {
    setSelectedPartners(selectedPartnerIds);
  }, [selectedPartnerIds]);

  // Admin or Partner access guard
  useEffect(() => {
    if (!user || (user.role !== Roles.ADMIN && user.role !== Roles.PARTNER)) {
      Alert.alert(
        'Access Denied',
        'You do not have permission to access this page.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    }
  }, [user, navigation]);

  // Fetch partners from API
  useEffect(() => {
    const fetchPartners = async () => {
      if (!user || (user.role !== Roles.ADMIN && user.role !== Roles.PARTNER)) {
        return;
      }

      try {
        setIsLoading(true);
        let response;

        if (user.role === Roles.ADMIN) {
          response = await PartnerService.getAllPartners();
          if (response.success && response.data && response.data.users) {
            setPartners(response.data.users);
          } else {
            Alert.alert('Error', 'Failed to fetch partners');
          }
        } else if (user.role === Roles.PARTNER) {
          response = await PartnerService.getAllTeamMembers(
            user.id.toString(),
            1,
            100,
          );
          if (response.success && response.data && response.data.teamMembers) {
            setPartners(
              response.data.teamMembers.map((tm: any) => ({
                ...tm,
                id: tm.teamMemberId,
              })),
            );
          } else {
            Alert.alert('Error', 'Failed to fetch partners');
          }
        }

        console.log('API Response:', response);
      } catch (error) {
        console.error('Error fetching partners:', error);
        Alert.alert('Error', 'Failed to fetch partners. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, [user]);

  // Create gradient colors from theme
  const headerGradientColors = useMemo(() => {
    return getGradientColors(theme.primaryColor);
  }, [theme.primaryColor]);

  // Early return if user is not admin or partner
  if (!user || (user.role !== Roles.ADMIN && user.role !== Roles.PARTNER)) {
    return (
      <View style={styles.container}>
        <Header<PartnerDrawerParamList>
          title="Filter Partners"
          gradientColors={headerGradientColors}
          backButton={true}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.accessDeniedContainer}>
          <GetIcon iconName="faq" size={48} color="#ff6b6b" />
          <Text style={styles.accessDeniedTitle}>Access Denied</Text>
          <Text style={styles.accessDeniedText}>
            You do not have permission to access this page.
          </Text>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: theme.primaryColor }]}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handlePartnerToggle = (partnerId: number) => {
    setSelectedPartners(prev => {
      if (prev.includes(partnerId)) {
        return prev.filter(id => id !== partnerId);
      } else {
        return [...prev, partnerId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedPartners.length === partners.length) {
      setSelectedPartners([]);
    } else {
      setSelectedPartners(partners.map(partner => partner.id));
    }
  };

  const handleApply = async () => {
    setIsApplying(true);
    try {
      // Update the global context with selected partner IDs
      setSelectedPartnerIds(selectedPartners);

      // Trigger clients refresh
      setClientsUpdated(prev => !prev);

      // Show success message using Toast

      if (selectedPartners.length === 0) {
        Toast.show({
          type: 'success',
          text1: 'Filter Cleared',
          text2: 'Showing clients for your account only.',
          position: 'top',
          visibilityTime: 2000,
        });
      } else {
        Toast.show({
          type: 'success',
          text1: 'Filter Applied',
          text2: `Showing clients for ${selectedPartners.length
            } selected partner${selectedPartners.length > 1 ? 's' : ''}.`,
          position: 'top',
          visibilityTime: 2000,
        });
      }

      // Navigate back after applying filter
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to apply filters. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderPartnerCard = ({ item }: { item: User }) => {
    const isSelected = selectedPartners.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.partnerCard, isSelected && styles.selectedCard]}
        onPress={() => handlePartnerToggle(item.id)}
        activeOpacity={0.7}>
        <View style={styles.partnerInfo}>
          <Text
            style={[
              styles.partnerName,
              isSelected && { color: theme.primaryColor },
            ]}>
            {item.name}
          </Text>
          <Text style={styles.partnerEmail}>{item.email}</Text>

          <View style={styles.partnerDetails}>
            {item.phone && (
              <View style={styles.detailRow}>
                <GetIcon iconName="phone" size={12} color="#666" />
                <Text style={styles.detailText}>{item.phone}</Text>
              </View>
            )}
            {item.location && (
              <View style={styles.detailRow}>
                <GetIcon iconName="compass" size={12} color="#666" />
                <Text style={styles.detailText}>{item.location}</Text>
              </View>
            )}
            <View style={styles.detailRow}>
              <GetIcon iconName="user" size={12} color="#666" />
              <Text style={styles.detailText}>Role: {item.role}</Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.checkmarkContainer,
            isSelected && [
              styles.selectedCheckmark,
              { backgroundColor: theme.primaryColor },
            ],
          ]}>
          {isSelected && (
            <GetIcon iconName="checkmark" size={14} color="white" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primaryColor} />
          <Text style={styles.loadingText}>
            {user?.role === Roles.ADMIN ? 'Loading partners...' : 'Loading team members...'}
          </Text>
        </View>
      );
    }

    return (
      <>
        <View style={styles.selectionHeader}>
          <Text style={styles.selectionText}>
            {selectedPartners.length} of {partners.length}{' '}
            {user.role === Roles.ADMIN ? 'partners' : 'team members'} selected
          </Text>
          <TouchableOpacity
            onPress={handleSelectAll}
            style={[styles.selectAllButton, { borderColor: theme.primaryColor }]}>
            <Text style={[styles.selectAllText, { color: theme.primaryColor }]}>
              {selectedPartners.length === partners.length
                ? 'Deselect All'
                : 'Select All'}
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={partners}
          renderItem={renderPartnerCard}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No partners found</Text>
            </View>
          }
        />

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.applyButton,
              { backgroundColor: theme.primaryColor },
              isApplying && styles.disabledButton,
            ]}
            onPress={handleApply}
            disabled={isApplying}
            activeOpacity={0.8}>
            {isApplying ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.applyButtonText}>
                Apply Filter ({selectedPartners.length})
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      {
        Platform.OS === 'android' && (
          <Header<PartnerDrawerParamList>
            title={
              user.role === Roles.ADMIN
                ? 'Filter Partners'
                : 'Filter Team Members'
            }
            gradientColors={headerGradientColors}
            backButton={true}
            onBackPress={handleBack}
          />
        )
      }
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  accessDeniedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  accessDeniedText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  selectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  selectAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 6,
  },
  selectAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  partnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: '#f8fff8',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  partnerInfo: {
    flex: 1,
    marginRight: 12,
  },
  partnerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  partnerEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  partnerDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
  },
  checkmarkContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  selectedCheckmark: {
    borderColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  applyButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default FilterPartnerScreen;
