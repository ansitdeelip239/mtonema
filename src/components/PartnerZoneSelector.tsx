import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import Colors from '../constants/Colors';
import {MasterDetailModel} from '../types';

interface PartnerZoneSelectorProps {
  partnerLocations: MasterDetailModel[];
  selectedZone: string;
  onZoneSelect: (zoneName: string) => void;
  errorMessage?: string;
}

const PartnerZoneSelector: React.FC<PartnerZoneSelectorProps> = ({
  partnerLocations,
  selectedZone,
  onZoneSelect,
  errorMessage,
}) => {
  const {t} = useTranslation();
  // Helper function to extract the logo URL from the description JSON
  const getLogoUrl = (description: string | undefined) => {
    if (!description) {
      return null;
    }

    try {
      const parsedDesc = JSON.parse(description);
      return parsedDesc?.iconUrl || null;
    } catch (error) {
      console.error('Error parsing location description:', error);
      return null;
    }
  };

  // Calculate optimal layout based on number of items
  const getLayoutConfig = (totalItems: number) => {
    if (totalItems <= 3) {
      return { rows: 1, itemsPerRow: totalItems };
    }

    // For 4 items: 2x2
    if (totalItems === 4) {
      return { rows: 2, itemsPerRow: 2 };
    }

    // For 5 items: 3 + 2
    if (totalItems === 5) {
      return { rows: 2, itemsPerRow: [3, 2] };
    }

    // For 6 items: 3x2 (user specified 3x3 but that would be 3 rows of 2)
    if (totalItems === 6) {
      return { rows: 2, itemsPerRow: 3 };
    }

    // For 7 items: 3 + 2 + 2
    if (totalItems === 7) {
      return { rows: 3, itemsPerRow: [3, 2, 2] };
    }

    // For 8 items: 3 + 3 + 2
    if (totalItems === 8) {
      return { rows: 3, itemsPerRow: [3, 3, 2] };
    }

    // For 9+ items: 3 per row
    const rows = Math.ceil(totalItems / 3);
    const itemsPerRow = [];
    for (let i = 0; i < rows; i++) {
      const remainingItems = totalItems - i * 3;
      itemsPerRow.push(Math.min(3, remainingItems));
    }
    return { rows, itemsPerRow };
  };

  const layoutConfig = getLayoutConfig(partnerLocations.length);

  // Group items into rows
  const getItemsForRow = (rowIndex: number) => {
    if (Array.isArray(layoutConfig.itemsPerRow)) {
      const startIndex = layoutConfig.itemsPerRow
        .slice(0, rowIndex)
        .reduce((sum, items) => sum + items, 0);
      const itemsInThisRow = layoutConfig.itemsPerRow[rowIndex];
      return partnerLocations.slice(startIndex, startIndex + itemsInThisRow);
    } else {
      const startIndex = rowIndex * layoutConfig.itemsPerRow;
      return partnerLocations.slice(startIndex, startIndex + layoutConfig.itemsPerRow);
    }
  };

  return (
    <View style={styles.partnerZoneSection}>
      <Text style={styles.partnerZoneLabel}>{t('auth.signUp.partner.zoneLabel')}</Text>
      <View style={styles.rowsContainer}>
        {Array.from({ length: layoutConfig.rows }, (_, rowIndex) => (
          <View key={rowIndex} style={styles.rowContainer}>
            {getItemsForRow(rowIndex).map(location => {
              const logoUrl = getLogoUrl(location.description);
              const isSelected = selectedZone === location.masterDetailName;

              return (
                <TouchableOpacity
                  key={location.id}
                  style={[
                    styles.partnerCard,
                    isSelected && styles.selectedCard,
                  ]}
                  onPress={() => onZoneSelect(location.masterDetailName)}
                  activeOpacity={0.7}>
                  <View style={styles.cardContent}>
                    {logoUrl ? (
                      <Image
                        source={{uri: logoUrl}}
                        style={styles.cardLogo}
                        resizeMode="contain"
                      />
                    ) : (
                      <View style={styles.placeholderLogo}>
                        <Text style={styles.placeholderText}>
                          {location.masterDetailName.charAt(0)}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.cardName,
                      isSelected && styles.selectedCardName,
                    ]}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {location.masterDetailName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
      {errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  partnerZoneSection: {
    marginBottom: 0,
  },
  partnerZoneLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.MT_PRIMARY_1,
    marginBottom: 12,
  },
  rowsContainer: {
    gap: 8,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  partnerCard: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.05)',
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
  selectedCard: {
    borderColor: Colors.MT_PRIMARY_1,
    borderWidth: 2,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    paddingVertical: 8,
  },
  cardLogo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  placeholderLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.MT_PRIMARY_1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  cardName: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: Colors.MT_SECONDARY_1,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  selectedCardName: {
    color: Colors.MT_PRIMARY_1,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: 4,
  },
});

export default PartnerZoneSelector;
