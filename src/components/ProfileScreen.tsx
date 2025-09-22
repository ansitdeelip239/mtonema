import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  RefreshControl,
} from 'react-native';
import Colors from '../constants/Colors';
import GetIcon, {IconEnum} from './GetIcon';
import BuyerSellerHeader from './BuyerSellerHeader';
import {useTranslation} from 'react-i18next';

export interface ProfileOption {
  id: string;
  title: string;
  icon: IconEnum;
  action?: string;
  subtitle?: string;
}

export interface ContactItem {
  id: string;
  icon: IconEnum;
  value: string;
}

export interface StatItem {
  id: string;
  value: string | number;
  label: string;
}

export interface UserData {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  createdOn?: string;
  joinDate?: string;
}

export interface ProfileScreenConfig {
  title: string;
  subtitle: string;
  userData?: UserData;
  profileOptions: ProfileOption[];
  contactItems?: ContactItem[];
  stats?: StatItem[];
  showStats?: boolean;
  showContactInfo?: boolean;
  showMembership?: boolean;
  loading?: boolean;
  error?: string;
  onRefresh?: () => Promise<void>;
  onOptionPress?: (optionId: string) => void;
}

interface ProfileScreenProps {
  config: ProfileScreenConfig;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({config}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const {t} = useTranslation();

  const handleRefresh = async () => {
    if (config.onRefresh) {
      setRefreshing(true);
      try {
        await config.onRefresh();
      } finally {
        setRefreshing(false);
      }
    }
  };

  const handleOptionPress = (optionId: string) => {
    config.onOptionPress?.(optionId);
  };

  // Show loading state
  if (config.loading) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <BuyerSellerHeader
            title={config.title}
            subtitle={config.subtitle}>
            <GetIcon iconName="threeDots" size={20} color="#333" />
          </BuyerSellerHeader>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t('profileScreen.loading.loadingProfile')}</Text>
        </View>
      </View>
    );
  }

  // Show error state if no user data
  if (!config.userData && !config.loading) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <BuyerSellerHeader
            title={config.title}
            subtitle={config.subtitle}>
            <GetIcon iconName="threeDots" size={20} color="#333" />
          </BuyerSellerHeader>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{config.error || t('profileScreen.loading.unableToLoad')}</Text>
        </View>
      </View>
    );
  }

  // Don't render main content if no user data
  if (!config.userData) {
    return null;
  }

  const {userData} = config;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          config.onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.MT_PRIMARY_1]}
              tintColor={Colors.MT_PRIMARY_1}
            />
          ) : undefined
        }>
        {/* Header */}
        <View style={styles.headerContainer}>
          <BuyerSellerHeader
            title={config.title}
            subtitle={config.subtitle} />
        </View>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <GetIcon iconName="user" color={Colors.MT_PRIMARY_1} size="40" />
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <GetIcon iconName="edit" color="white" size="16" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
          {userData.location && (
            <Text style={styles.userLocation}>{userData.location}</Text>
          )}
        </View>

        {/* Stats Section */}
        {config.showStats && config.stats && config.stats.length > 0 && (
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>{t('profileScreen.sections.accountOverview')}</Text>
            <View style={styles.statsGrid}>
              {config.stats.map(stat => (
                <View key={stat.id} style={styles.statCard}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Profile Options */}
        <View style={styles.optionsSection}>
          <Text style={styles.sectionTitle}>{t('profileScreen.sections.accountSettings')}</Text>
          {config.profileOptions.map(option => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionCard}
              onPress={() => handleOptionPress(option.id)}
            >
              <View style={styles.optionLeft}>
                <View style={styles.optionIcon}>
                  <GetIcon
                    iconName={option.icon}
                    color={Colors.MT_PRIMARY_1}
                    size="24"
                  />
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  {option.subtitle && (
                    <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                  )}
                </View>
              </View>
              <GetIcon
                iconName="chevronRight"
                color={Colors.MT_SECONDARY_2}
                size="16"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact Information */}
        {config.showContactInfo && config.contactItems && config.contactItems.length > 0 && (
          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>{t('profileScreen.sections.contactInformation')}</Text>
            <View style={styles.contactCard}>
              {config.contactItems.map(item => (
                <View key={item.id} style={styles.contactItem}>
                  <GetIcon
                    iconName={item.icon}
                    color={Colors.MT_SECONDARY_2}
                    size="20"
                  />
                  <Text style={styles.contactText}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Member Since */}
        {config.showMembership && (userData.createdOn || userData.joinDate) && (
          <View style={styles.membershipSection}>
            <Text style={styles.membershipText}>
              {t('profileScreen.membership.memberSince')} {userData.createdOn
                ? new Date(userData.createdOn).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
                : userData.joinDate}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom: 80,
  },
  headerContainer: {
    marginBottom: 15,
  },
  scrollContainer: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.MT_PRIMARY_1,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: Colors.MT_SECONDARY_2,
    marginBottom: 3,
  },
  userLocation: {
    fontSize: 14,
    color: Colors.MT_SECONDARY_2,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '30%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.MT_PRIMARY_1,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.MT_SECONDARY_2,
    textAlign: 'center',
  },
  optionsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  optionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    color: Colors.MT_SECONDARY_2,
  },
  contactSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  contactCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  contactText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    flex: 1,
  },
  membershipSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  membershipText: {
    fontSize: 14,
    color: Colors.MT_SECONDARY_2,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.MT_SECONDARY_2,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ff6b6b',
  },
});
