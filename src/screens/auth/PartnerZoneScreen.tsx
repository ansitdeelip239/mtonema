import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigator/AuthNavigator';
import {useMaster} from '../../context/MasterProvider';
import Colors from '../../constants/Colors';
import Images from '../../constants/Images';
import {MasterDetailModel} from '../../types';
import HeaderComponent from './components/HeaderComponent';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');
type Props = NativeStackScreenProps<AuthStackParamList, 'PartnerZoneScreen'>;

const PartnerZoneScreen: React.FC<Props> = ({navigation, route}) => {
  const {masterData} = useMaster();
  const roles = route.params.role;

  const handleLocationPress = (locationName: MasterDetailModel) => {
    navigation.navigate('EmailScreen', {
      role: roles,
      location: locationName,
    });
  };

  // Helper function to extract the logo URL from the description JSON
  const getLogoUrl = (description: string | undefined) => {
    if (!description) {
      return null;
    }

    try {
      const parsedDesc = JSON.parse(description);
      return parsedDesc?.imageUrl || null;
    } catch (error) {
      console.error('Error parsing location description:', error);
      return null;
    }
  };

  // Render each partner location item
  const renderLocationItem = ({item}: {item: MasterDetailModel}) => {
    const logoUrl = getLogoUrl(item.description);

    return (
      <TouchableOpacity
        style={styles.locationButton}
        onPress={() => handleLocationPress(item)}
        activeOpacity={0.7}>
        <LinearGradient
          colors={['#ffffff', '#f8f9fa']}
          style={styles.gradientContainer}>
          <View style={styles.locationContent}>
            {logoUrl ? (
              <Image
                source={{uri: logoUrl}}
                style={styles.partnerLogo}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.placeholderLogo}>
                <Text style={styles.placeholderText}>
                  {item.masterDetailName.charAt(0)}
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderComponent
        title="Partner Zone"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.headerContainer}>
        <Image
          source={Images.MTESTATES_LOGO}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>
          Select your preferred working location
        </Text>
      </View>

      {!masterData || !masterData.PartnerLocation ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.MT_PRIMARY_1} />
          <Text style={styles.loadingText}>Loading locations...</Text>
        </View>
      ) : (
        <FlatList
          data={masterData.PartnerLocation.sort((a, b) => a.id - b.id)}
          renderItem={renderLocationItem}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'white',
    marginBottom: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    paddingHorizontal: 16,
  },
  logo: {
    width: 140,
    height: 70,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.MT_SECONDARY_1,
    paddingHorizontal: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: Colors.MT_SECONDARY_2,
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    paddingTop: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  locationButton: {
    width: (width - 36) / 2, // Account for horizontal padding and gap
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  gradientContainer: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
  },
  locationContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 100, // Fixed height for consistent button size
  },
  partnerLogo: {
    width: 100, // Adjust width for proper centering
    height: 100, // Adjust height for proper centering
    resizeMode: 'contain', // Ensure the logo fits within the bounds
  },
  placeholderLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.MT_PRIMARY_1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default PartnerZoneScreen;
