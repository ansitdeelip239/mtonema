import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import BuyerSellerHeader from '../../components/BuyerSellerHeader';
import GetIcon from '../../components/GetIcon';
import Colors from '../../constants/Colors';
import {IconEnum} from '../../components/GetIcon';

interface StatCardProps {
  title: string;
  value: number;
  icon: IconEnum;
}

const StatCard: React.FC<StatCardProps> = ({title, value, icon}) => (
  <View style={styles.statCardWrapper}>
    <View style={styles.statCard}>
      <GetIcon iconName={icon} color={Colors.MT_PRIMARY_1} size="24" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  </View>
);

interface QuickActionButtonProps {
  title: string;
  icon: IconEnum;
  color: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  title,
  icon,
  color,
}) => (
  <View style={styles.actionButtonWrapper}>
    <TouchableOpacity style={[styles.actionButton, {borderColor: color}]}>
      <GetIcon iconName={icon} color={color} size="20" />
      <Text style={[styles.actionButtonText, {color}]}>{title}</Text>
    </TouchableOpacity>
  </View>
);

const SellerDashboard = () => {
  // Dummy data for dashboard stats
  const stats = {
    totalProperties: 25,
    activeProperties: 18,
    pendingProperties: 4,
    soldProperties: 3,
    totalViews: 1250,
    totalInquiries: 45,
  };

  const quickActions = [
    {
      id: 'add',
      title: 'Add Property',
      icon: 'plus' as IconEnum,
      color: Colors.MT_PRIMARY_1,
    },
    {
      id: 'list',
      title: 'View Listings',
      icon: 'listproperty' as IconEnum,
      color: Colors.MT_SECONDARY_1,
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: 'realEstate' as IconEnum,
      color: Colors.MT_SECONDARY_2,
    },
    {
      id: 'profile',
      title: 'Profile',
      icon: 'user' as IconEnum,
      color: Colors.MT_PRIMARY_2,
    },
  ];

  return (
    <View style={styles.container}>
      <BuyerSellerHeader
        title="Seller Dashboard"
        subtitle="Manage your properties"
      >
        <GetIcon iconName="settings" size={20} color="#333" />
      </BuyerSellerHeader>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome back!</Text>
          <Text style={styles.welcomeSubtitle}>
            Here's what's happening with your properties today.
          </Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Total Properties"
              value={stats.totalProperties}
              icon="home"
            />
            <StatCard
              title="Active"
              value={stats.activeProperties}
              icon="checkmark"
            />
            <StatCard
              title="Pending"
              value={stats.pendingProperties}
              icon="time"
            />
            <StatCard
              title="Sold"
              value={stats.soldProperties}
              icon="property"
            />
          </View>
        </View>

        {/* Performance Section */}
        <View style={styles.performanceSection}>
          <Text style={styles.sectionTitle}>Performance</Text>
          <View style={styles.performanceCardWrapper}>
            <View style={styles.performanceCard}>
              <View style={styles.performanceItem}>
                <GetIcon iconName="eye" color={Colors.MT_SECONDARY_2} size="16" />
                <Text style={styles.performanceText}>
                  {stats.totalViews} total views this month
                </Text>
              </View>
              <View style={styles.performanceItem}>
                <GetIcon
                  iconName="message"
                  color={Colors.MT_SECONDARY_2}
                  size="16"
                />
                <Text style={styles.performanceText}>
                  {stats.totalInquiries} inquiries received
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions Section */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map(action => (
              <QuickActionButton
                key={action.id}
                title={action.title}
                icon={action.icon}
                color={action.color}
              />
            ))}
          </View>
        </View>

        {/* Recent Activity Placeholder */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCardWrapper}>
            <View style={styles.activityCard}>
              <Text style={styles.activityText}>
                No recent activity to show. Start by adding your first property!
              </Text>
            </View>
          </View>
        </View>
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
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.MT_SECONDARY_2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  statsSection: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  statCardWrapper: {
    width: '48%',
    marginBottom: 16,
    padding: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.MT_PRIMARY_1,
    marginTop: 8,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: Colors.MT_SECONDARY_2,
    textAlign: 'center',
  },
  performanceSection: {
    marginBottom: 24,
  },
  performanceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
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
  performanceCardWrapper: {
    padding: 4,
  },
  performanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  performanceText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
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
  actionButtonWrapper: {
    width: '48%',
    marginBottom: 16,
    padding: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  activitySection: {
    marginBottom: 24,
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
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
  activityCardWrapper: {
    padding: 4,
  },
  activityText: {
    fontSize: 14,
    color: Colors.MT_SECONDARY_2,
    textAlign: 'center',
  },
});

export default SellerDashboard;
