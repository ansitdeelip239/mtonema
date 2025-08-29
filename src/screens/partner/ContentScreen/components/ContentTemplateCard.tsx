import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import GetIcon from '../../../../components/GetIcon';
import {ContentTemplate} from '../../../../types';
import Status from '../../../../constants/Status';
import {formatLocalizedDate} from '../../../../utils/dateUtils';

interface ContentTemplateCardProps {
  item: ContentTemplate;
  onPress?: (item: ContentTemplate) => void;
  onEdit?: (item: ContentTemplate) => void;
}

const ContentTemplateCard: React.FC<ContentTemplateCardProps> = ({
  item,
  onPress,
  onEdit,
}) => {
  const {t, i18n} = useTranslation();

  // Format date with localization
  const formatDate = (dateString: string) => {
    try {
      return formatLocalizedDate(dateString, i18n.language);
    } catch {
      return t('contentTemplate.errors.invalidDate', 'Invalid date');
    }
  };

  // Handle "by" preposition based on language
  const getCreatorText = (creatorName: string) => {
    const currentLanguage = i18n.language;

    // For Hindi, the format is "Name द्वारा" (name comes first)
    if (currentLanguage === 'hi') {
      return `${creatorName} ${t('contentTemplate.labels.by', 'द्वारा')}`;
    }

    // For other languages, use "by Name" format
    return `${t('contentTemplate.labels.by', 'by')} ${creatorName}`;
  };

  // Get localized status
  const getLocalizedStatus = (status: string) => {
    switch (status) {
      case Status.ACTIVE:
        return t('contentTemplate.status.active', 'Active');
      case Status.INACTIVE:
        return t('contentTemplate.status.inactive', 'Inactive');
      case Status.DELETED:
        return t('contentTemplate.status.deleted', 'Deleted');
      default:
        return status;
    }
  };

  return (
    <TouchableOpacity
      style={styles.templateCard}
      activeOpacity={0.7}
      onPress={() => onPress?.(item)}>
      <View style={styles.templateHeader}>
        <View style={styles.templateInfo}>
          <Text style={styles.templateName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.templateCreator}>
            {getCreatorText(item.creatorName)}
          </Text>
        </View>
        <View style={styles.templateActions}>
          {/* <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onView?.(item)}>
            <GetIcon iconName="eye" size={20} color={Colors.MT_PRIMARY_1} />
          </TouchableOpacity> */}
          {onEdit && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={e => {
                e.stopPropagation(); // Prevent card press
                onEdit(item);
              }}>
              <GetIcon iconName="edit" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Text style={styles.templateContent} numberOfLines={3}>
        {item.content}
      </Text>

      <View style={styles.templateFooter}>
        <Text style={styles.templateDate}>
          {t('contentTemplate.labels.created', 'Created')}:{' '}
          {formatDate(item.createdOn)}
        </Text>
        <View
          style={[
            styles.statusBadge,
            item.recordStatus === Status.ACTIVE
              ? styles.activeBadge
              : styles.inactiveBadge,
          ]}>
          <Text
            style={[
              styles.statusText,
              item.recordStatus === Status.ACTIVE
                ? styles.activeText
                : styles.inactiveText,
            ]}>
            {getLocalizedStatus(item.recordStatus)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  templateCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  templateInfo: {
    flex: 1,
    marginRight: 12,
  },
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  templateCreator: {
    fontSize: 12,
    color: '#666',
  },
  templateActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  templateContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  templateFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  templateDate: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#e6f7e6',
  },
  inactiveBadge: {
    backgroundColor: '#ffe6e6',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeText: {
    color: '#2d8f2d',
  },
  inactiveText: {
    color: '#d32f2f',
  },
});

export default ContentTemplateCard;
