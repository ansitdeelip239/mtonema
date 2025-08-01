import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
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

  return (
    <View style={styles.partnerZoneSection}>
      <Text style={styles.partnerZoneLabel}>Zone*:</Text>
      <View style={styles.cardsContainer}>
        {partnerLocations.slice(0, 3).map(location => {
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
  cardsContainer: {
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
