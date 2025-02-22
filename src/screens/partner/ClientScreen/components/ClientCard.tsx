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
}

export const ClientCard: React.FC<ClientCardProps> = ({client, navigation}) => {
  const handleWhatsapp = () => {
    Linking.openURL(
      `https://api.whatsapp.com/send?phone=${client.whatsappNumber}`,
    );
  };

  const handlePhone = () => {
    Linking.openURL(`tel:${client.mobileNumber}`);
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
                {formatDate(client.createdOn, 'dd MMM yy')}
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

          <View style={styles.groupContainer}>
            <Text style={styles.label}>Groups:</Text>
            <GroupBadges groups={client.groups} />
          </View>

          <View style={styles.activitySection}>
            <View style={styles.row}>
              {client.clientActivityDataModels?.length > 0 ? (
                <>
                  <Text style={styles.label}>Last Activity:</Text>
                  <Text style={styles.lastActivity}>
                    {formatDate(
                      client.clientActivityDataModels.sort(
                        (a, b) =>
                          new Date(b.CreatedOn).getTime() -
                          new Date(a.CreatedOn).getTime(),
                      )[0].CreatedOn,
                      'PPpp',
                    )}
                  </Text>
                </>
              ) : (
                <Text style={styles.noActivity}>No activities yet</Text>
              )}
            </View>
          </View>
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
    fontSize: 13,
    color: '#444',
    flex: 1,
  },
  noActivity: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
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
});
