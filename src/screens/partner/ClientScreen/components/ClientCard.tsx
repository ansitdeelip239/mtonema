import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Linking,
  TouchableOpacity,
} from 'react-native';
import {Client} from '../../../../types';
import {formatDate} from '../../../../utils/dateUtils';
import GroupBadges from './GroupBadge';
import {ClientStackParamList} from '../../../../navigator/components/ClientScreenStack';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

interface ClientCardProps {
  client: Client;
  navigation: NativeStackNavigationProp<
    ClientStackParamList,
    'ClientScreen',
    undefined
  >;
  onContactPress?: (
    type: 'phone' | 'whatsapp',
    client: Client,
    activityTypeId?: number | null,
  ) => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({
  client,
  navigation,
  onContactPress,
}) => {
  const handleWhatsapp = () => {
    // Open WhatsApp
    Linking.openURL(
      `https://api.whatsapp.com/send?phone=${client.whatsappNumber}`,
    );

    // Trigger activity recording if handler is provided
    if (onContactPress) {
      onContactPress('whatsapp', client);
    }
  };

  const handlePhone = () => {
    // Make phone call
    Linking.openURL(`tel:${client.mobileNumber}`);

    // Trigger activity recording if handler is provided
    if (onContactPress) {
      onContactPress('phone', client);
    }
  };

  const handleCardPress = () => {
    navigation.navigate('ClientProfileScreen', {clientId: client.id});
  };

  return (
    <TouchableOpacity onPress={handleCardPress} activeOpacity={0.7}>
      <View style={styles.clientCard}>
        <View style={styles.cardHeader}>
          <View style={styles.dateContainer}>
            <View style={styles.dateBlock}>
              <Text style={styles.dateLabel}>Date Added</Text>
              <Text style={styles.dateText}>
                {client.createdOn && formatDate(client.createdOn, 'dd MMM yy')}
              </Text>
            </View>
            <View style={styles.iconContainer}>
              {client.mobileNumber && (
                <TouchableOpacity onPress={handlePhone}>
                  <Image
                    source={require('../../../../assets/Icon/phone.png')}
                    style={styles.phoneIcon}
                  />
                </TouchableOpacity>
              )}
              {client.whatsappNumber && (
                <TouchableOpacity onPress={handleWhatsapp}>
                  <Image
                    source={require('../../../../assets/Icon/whatsapp.png')}
                    style={styles.whatsappIcon}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.row}>
            <Text style={styles.label}>Client Name:</Text>
            <Text style={styles.clientName}>{client.clientName}</Text>
          </View>

          {client.groups.length > 0 && (
            <View style={styles.groupContainer}>
              <Text style={styles.label}>Groups:</Text>
              <GroupBadges groups={client.groups} />
            </View>
          )}

          {/* Assigned Team Members */}
          {client.assignedTeamIds && client.assignedTeamIds.length > 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>Assigned To:</Text>
              <View style={styles.assignedBadgesContainer}>
                {client.assignedTeamIds.map(member => (
                  <View key={member.id} style={styles.assignedBadge}>
                    <Text style={styles.assignedBadgeText}>{member.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {client.createdBy && (
            <View style={styles.row}>
              <Text style={styles.label}>Created By:</Text>
              <View style={styles.creatorInfoContainer}>
                <Text style={styles.dateText}>{client.createdBy.name}</Text>
                <Text style={styles.creatorEmail}>
                  ({client.createdBy.email})
                </Text>
              </View>
            </View>
          )}

          {client.lastActivityDate ? (
            <View style={styles.row}>
              <Text style={styles.label}>Last Activity:</Text>
              <Text style={styles.lastActivity}>{formatDate(client.lastActivityDate, 'dd MMM yy, h:mm a')}</Text>
            </View>
          ) : (
            <View style={styles.row}>
              <Text style={styles.label}>Last Activity:</Text>
              <Text style={styles.noActivity}>No activity recorded</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  clientCard: {
    backgroundColor: 'white',
    marginBottom: 16,
    elevation: 5,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: 'rgba(0, 102, 204, 0.03)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateBlock: {
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#0066cc',
    fontWeight: '600',
  },
  cardContent: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  groupContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  label: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
    marginRight: 8,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  activitySection: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  lastActivity: {
    fontSize: 14,
    color: '#0066cc',
    fontWeight: '600',
    flex: 1,
  },
  noActivity: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    flex: 1,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  whatsappIcon: {
    width: 30,
    height: 30,
  },
  phoneIcon: {
    width: 20,
    height: 20,
  },
  creatorInfoContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  creatorEmail: {
    fontSize: 12,
    color: '#888',
  },
  assignedBadgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 1,
    alignItems: 'center',
    flex: 1,
  },
  assignedBadge: {
    backgroundColor: '#e6f0fa',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#b3d4fc',
  },
  assignedBadgeText: {
    color: '#0066cc',
    fontWeight: '600',
    fontSize: 13,
  },
});
