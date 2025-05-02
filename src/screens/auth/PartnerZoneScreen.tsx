import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigator/AuthNavigator';
import {useMaster} from '../../context/MasterProvider';
import Colors from '../../constants/Colors';
import Images from '../../constants/Images';
import {MasterDetailModel} from '../../types';
import LinearGradient from 'react-native-linear-gradient';

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

  return (
    <View style={styles.container}>
      {/* Add header here */}
      <LinearGradient
        colors={[Colors.MT_PRIMARY_1, '#1e5799']}
        style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <View style={styles.spacer} />
          <Text style={styles.headerText}>Partner Zone</Text>
          <View style={styles.spacer} />
        </View>
      </LinearGradient>

      <View style={styles.headerContainer}>
        <Image
          source={Images.MTESTATES_LOGO}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>
          Select your preferred location to continue
        </Text>
      </View>

      {!masterData || !masterData.PartnerLocation ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.MT_PRIMARY_1} />
          <Text style={styles.loadingText}>Loading locations...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}>
          {masterData.PartnerLocation.map(
            location =>
              location.masterDetailName !== 'Individual' && (
                <TouchableOpacity
                  key={location.id}
                  style={styles.locationButton}
                  onPress={() => handleLocationPress(location)}>
                  <Text style={styles.locationText}>
                    {location.masterDetailName}
                  </Text>
                </TouchableOpacity>
              ),
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20, // Change from 20:10 to 50:20
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 20, // Change from 22 to 20
    fontWeight: 'bold',
    color: 'white',
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  spacer: {
    width: 24,
  },
  logo: {
    width: 150,
    height: 80,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.MT_SECONDARY_1,
    paddingHorizontal: 32,
    marginBottom: 16,
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  locationButton: {
    backgroundColor: Colors.MT_SECONDARY_3,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.MT_PRIMARY_1 + '20',
  },
  locationText: {
    fontSize: 16,
    color: Colors.MT_SECONDARY_1,
    fontWeight: '500',
  },
});

export default PartnerZoneScreen;
