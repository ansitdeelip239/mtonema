import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AgentData} from '../../../../types';
import {formatCurrency} from '../../../../utils/currency';
import {IconButton, Surface} from 'react-native-paper';
import GetIcon from '../../../../components/GetIcon';
import PartnerService from '../../../../services/PartnerService';
import Toast from 'react-native-toast-message';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import {AgentDataStackParamList} from '../../../../navigator/components/AgentDataStack';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTheme} from '../../../../context/ThemeProvider';
import {useTranslation} from 'react-i18next';
import {formatLocalizedDate} from '../../../../utils/dateUtils';
import i18n from 'i18next';

interface RenderItemProps {
  item: AgentData;
  onDataUpdate: () => void;
  navigation: NativeStackNavigationProp<
    AgentDataStackParamList,
    'AgentDataScreen'
  >;
}

const RenderItem: React.FC<RenderItemProps> = ({
  item,
  onDataUpdate,
  navigation,
}) => {
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {theme} = useTheme();
  const {t} = useTranslation();

  const onEdit = () => {
    navigation.navigate('AddAgentDataScreen', {
      editMode: true,
      propertyData: item,
    });
  };

  const handleDeletePress = () => {
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await PartnerService.deleteAgentProperty(item.id);
      if (response.success) {
        Toast.show({
          type: 'success',
          text1: t('agentProperty.messages.deleteSuccess'),
          visibilityTime: 3000,
        });
        onDataUpdate();
      }
    } catch (error) {
      console.error('Error in deleting property:', error);
      Toast.show({
        type: 'error',
        text1: t('agentProperty.messages.deleteError'),
        visibilityTime: 4000,
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteModalVisible(false);
    }
  };

  return (
    <>
      <Surface style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.name, {color: theme.primaryColor}]}>
              {item.agentName || 'N/A'}
            </Text>
            <View
              style={[
                styles.badge,
                {backgroundColor: theme.primaryColor + '15'},
              ]}>
              <Text style={[styles.badgeText, {color: theme.primaryColor}]}>
                {item.negotiable ? t('agentProperty.labels.negotiable') : t('agentProperty.labels.fixedPrice')}
              </Text>
            </View>
          </View>
          <View style={styles.actions}>
            <IconButton
              icon={() =>
                GetIcon({iconName: 'edit', color: theme.primaryColor})
              }
              size={20}
              onPress={() => onEdit()}
              iconColor={theme.primaryColor}
              style={styles.actionButton}
            />
            <IconButton
              icon={() =>
                GetIcon({iconName: 'delete', color: theme.primaryColor})
              }
              size={20}
              onPress={handleDeletePress}
              iconColor={theme.primaryColor}
              style={styles.actionButton}
            />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.contentSection}>
          <View style={styles.row}>
            <Text style={styles.label}>{t('agentProperty.labels.bhkType')}</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{item.bhkType || t('agentProperty.messages.notSpecified')}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t('agentProperty.labels.location')}</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{item.propertyLocation || t('agentProperty.messages.na')}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t('agentProperty.labels.demandPrice')}</Text>
            <Text style={styles.colon}>:</Text>
            <Text
              style={[
                styles.value,
                styles.priceText,
                {color: theme.primaryColor},
              ]}>
              {formatCurrency(item.demandPrice) || t('agentProperty.messages.na')}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t('agentProperty.labels.securityDepositAmount')}</Text>
            <Text style={styles.colon}>:</Text>
            <Text
              style={[
                styles.value,
                styles.priceText,
                {color: theme.primaryColor},
              ]}>
              {formatCurrency(item.securityDepositAmount) || t('agentProperty.messages.na')}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t('agentProperty.labels.contactNo')}</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{item.agentContactNo || t('agentProperty.messages.na')}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t('agentProperty.labels.propertyType')}</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{item.propertyType || t('agentProperty.messages.na')}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t('agentProperty.labels.dateAdded')}</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>
              {item.createdOn
                ? formatLocalizedDate(item.createdOn, i18n.language)
                : t('agentProperty.messages.na')}
            </Text>
          </View>
        </View>

        {item.propertyNotes && (
          <>
            <View style={styles.divider} />
            <View style={styles.notes}>
              <Text style={styles.notesLabel}>{t('agentProperty.labels.notes')}</Text>
              <Text style={styles.notesText}>{item.propertyNotes}</Text>
            </View>
          </>
        )}
      </Surface>

      <ConfirmationModal
        visible={isDeleteModalVisible}
        title={t('agentProperty.titles.deleteProperty')}
        message={t('agentProperty.messages.deleteConfirmation')}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        isLoading={isDeleting}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 4,
    marginVertical: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    margin: 0,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  contentSection: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
    minWidth: 120,
    color: '#666',
    fontSize: 14,
    textAlign: 'left',
    paddingRight: 2,
  },
  colon: {
    width: 12,
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  value: {
    flex: 1,
    color: '#333',
    fontSize: 14,
  },
  priceText: {
    fontWeight: '700',
  },
  notes: {
    padding: 16,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  notesText: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default RenderItem;
