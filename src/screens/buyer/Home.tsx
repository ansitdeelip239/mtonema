import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {useBuyer} from '../../context/BuyerProvider';
import {useAuth} from '../../hooks/useAuth';
import Images from '../../constants/Images';

type HomeProps = {
  navigation: DrawerNavigationProp<any>;
};

const Home = ({navigation}: HomeProps) => {
  const {user} = useAuth();
  const {buyerData} = useBuyer();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (buyerData) {
      setIsLoading(false);
    }
  }, [buyerData]);

  const goToRecomendedProperty = () => {
    navigation.navigate('RecomendedProperty', {
      title: 'Recommended Properties',
      description: 'Explore the best properties recommended for you.',
    });
  };

  const goToSearchProperty = () => {
    navigation.navigate('SearchProperty', {
      title: 'Search Properties',
      description: 'Find properties based on your preferences.',
    });
  };

  return (
    <ImageBackground
      source={Images.BACKGROUND_IMAGE}
      style={styles.backgroundImage}
      resizeMode="cover">
      <View style={styles.container}>
        {/* Top Bar with Icon and Text */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Image source={Images.MENU} style={styles.menuIcon} />
          </TouchableOpacity>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>

        {/* Card for Recommended Property */}
        <TouchableOpacity style={styles.card} onPress={goToRecomendedProperty}>
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>Recommended Property</Text>
            <View style={styles.countCircle}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.countText}>
                  {buyerData?.totalCount || 0}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>

        {/* Card for Search Property */}
        <TouchableOpacity
          style={[styles.card, isLoading && styles.disabledCard]}
          onPress={goToSearchProperty}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#cc0e74" />
          ) : (
            <Text style={styles.cardText}>Search Property</Text>
          )}
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  topBar: {
    position: 'absolute',
    top: 20,
    borderRadius: 15,
    width: '95%', // 90% width
    alignSelf: 'center', // Center the top bar
    marginHorizontal: '5%', // 5% space on both sides
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 182, 193, 0.6)', // Light pink with low opacity
  },
  menuIcon: {
    width: 24,
    height: 24,
  },
  userName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  countCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#cc0e74',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    width: '80%',
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  disabledCard: {
    opacity: 0.5,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Home;
