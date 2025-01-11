import { View, Text, TouchableOpacity, StyleSheet,ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { useBuyer } from '../../context/BuyerProvider';
type HomeProps = {
  navigation: NavigationProp<any>;
};

const Home = ({ navigation }: HomeProps) => {
const { buyerData } = useBuyer();
const [isLoading, setIsLoading] = useState(true);
console.log(buyerData);
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
        <View style={styles.container}>
        {/* Card for Recommended Property */}
        <TouchableOpacity
        style={styles.card}
        onPress={goToRecomendedProperty}
      >
        <View style={styles.cardContent}>
          <Text style={styles.cardText}>Recommended Property</Text>
          <View style={styles.countCircle}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.countText}>{buyerData?.totalCount || 0}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
        {/* Card for Search Property */}
        <TouchableOpacity
          style={styles.card}
          onPress={goToSearchProperty}
        >
          <Text style={styles.cardText}>Search Property</Text>
        </TouchableOpacity>
      </View>
  );
};
// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
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
    borderRadius: 20, // Make it a circle
    backgroundColor: '#cc0e74', // Attractive background color
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', // White text for contrast
  },
  card: {
    width: '80%',
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Home;
