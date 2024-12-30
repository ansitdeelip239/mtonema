import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { api } from '../../utils/api';
import url from '../../constants/api';
import { PropertyModel } from '../../types';
import { useAuth } from '../../hooks/useAuth';


const ContactedProperty = () => {
 const [properties, setProperties] = useState<PropertyModel[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [pageNo, setPageNo] = useState(1);
 const [hasMore, setHasMore] = useState(true);
 const [isFetchingMore, setIsFetchingMore] = useState(false);
 const { user } = useAuth();
 const pageSize = 10;

 const getcontactedProperty = async (pageNumber: number, pageSize: number) => {
   if (isFetchingMore) return;
   try {
     if (pageNumber === 1) {
       setLoading(true);
     } else {
       setIsFetchingMore(true);
     }
     const requestBody = {
       Address: "",
       BhkType: "",
       City: "",
       FurnishType: "",
       MaxPrice: 0,
       MinPrice: 0,
       Place: null,
       Price: "",
       PropertyFor: null,
       PropertyType: null,
       Relevance: "",
       SellerType: "",
       ZipCode: "",
       pageNumber: pageNumber,
       pageSize: pageSize
     };


     // Check if user exists
     if (!user?.ID) {
       throw new Error('User ID is required');
     }


     // Make the API call with explicit typing
    
     const response = await api.post<any>(
       `${url.getListOfContactedProperty}?pageNumber=${pageNumber}&pageSize=${pageSize}&id=${user.ID}`,
       requestBody
     );

     // Handle the response
     const responseData = response?.data;
     
   

     console.log(response)
     // console.log('API Response:', JSON.stringify(responseData, null, 2));


     if (!responseData) {
       throw new Error('No data received from server');
     }


     if (responseData?.contactedPropertyModels) {
       const newProperties = responseData.contactedPropertyModels;
console.log('*****new propertties**********',newProperties)

       // Update properties state based on page number
       setProperties(prevProperties =>
         pageNumber === 1 ? newProperties : [...prevProperties, ...newProperties]
       );


       // Update hasMore state
       setHasMore(newProperties.length >= pageSize);
     } else {
       // If no properties found, set hasMore to false
       setHasMore(false);
       if (pageNumber === 1) {
         setProperties([]);
       }
     }
   } catch (error) {
     console.error('Error details:', error);
     setError('Failed to fetch properties');
     setHasMore(false);
   } finally {
     setLoading(false);
     setIsFetchingMore(false);
   }
 };


 // Reset pagination when user changes
 useEffect(() => {
   setPageNo(1);
   setProperties([]);
   setHasMore(true);
 }, [user?.ID]);


 // Fetch properties when page changes
 useEffect(() => {
   if (user?.ID) {
     getcontactedProperty(pageNo, pageSize);
   }
 }, [pageNo, user?.ID]);


 const loadMore = () => {
   if (hasMore && !isFetchingMore && !loading) {
     setPageNo(prev => prev + 1);
   }
 };
 const renderPropertyItem = ({ item }: { item: PropertyModel }) => (
   <View key={item.ID} style={styles.propertyCard}>
     <Text style={styles.locationText}>
       {item.PropertyLocation || item.City?.MasterDetailName || 'Location not specified'}
     </Text>
     <Text style={styles.propertyType}>
       {item.PropertyType?.MasterDetailName || 'N/A'} for {item.PropertyFor?.MasterDetailName || 'N/A'}
     </Text>
     <View style={styles.detailsRow}>
       <Text style={styles.price}>
         ₹{item.Price || 'N/A'} {item.Rate?.MasterDetailName || ''}
       </Text>
       <Text style={styles.area}>
         {item.Area || 'N/A'} {item.Size?.MasterDetailName || ''}
       </Text>
     </View>
     <View style={styles.additionalDetails}>
       {item.Furnishing && (
         <Text style={styles.detailText}>
           Furnishing: {item.Furnishing.MasterDetailName}
         </Text>
       )}
       <Text style={styles.detailText}>
         Ready to Move: {item.readyToMove || 'Not specified'}
       </Text>
     </View>
     <View style={styles.sellerDetails}>
       <Text style={styles.sellerName}>Listed by: {item.SellerName || 'N/A'}</Text>
       <Text style={styles.sellerPhone}>Contact: {item.SellerPhone || 'N/A'}</Text>
     </View>
   </View>
 );


 if (loading && pageNo === 1) {
   return (
     <View style={styles.centerContainer}>
       <ActivityIndicator size="large" color="#0066cc" />
     </View>
   );
 }


 if (error && properties.length === 0) {
   return (
     <View style={styles.centerContainer}>
       <Text style={styles.errorText}>{error}</Text>
     </View>
   );
 }


 return (
   <FlatList
     style={styles.container}
     data={properties}
     keyExtractor={(item) => item.ID?.toString() || Math.random().toString()}
     renderItem={renderPropertyItem}
     onEndReached={loadMore}
     onEndReachedThreshold={0.5}
     ListFooterComponent={
       isFetchingMore ? (
         <View style={styles.footer}>
           <ActivityIndicator size="small" color="#0066cc" />
         </View>
       ) : null
     }
     ListEmptyComponent={() => {
       if (loading) return null;
       return (
         <View style={styles.centerContainer}>
           <Text style={styles.noDataText}>No properties available</Text>
         </View>
       );
     }}
   />
 );
};


const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#f5f5f5',
   padding: 10,
 },
 centerContainer: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   minHeight: 300,
 },
 propertyCard: {
   backgroundColor: 'white',
   borderRadius: 8,
   padding: 15,
   marginBottom: 15,
   elevation: 3,
   shadowColor: '#000',
   shadowOffset: {
     width: 0,
     height: 2,
   },
   shadowOpacity: 0.25,
   shadowRadius: 3.84,
 },
 locationText: {
   fontSize: 18,
   fontWeight: 'bold',
   color: '#333',
   marginBottom: 5,
 },
 propertyType: {
   fontSize: 16,
   color: '#666',
   marginBottom: 10,
 },
 detailsRow: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   marginBottom: 10,
 },
 price: {
   fontSize: 16,
   fontWeight: 'bold',
   color: '#2c5282',
 },
 area: {
   fontSize: 16,
   color: '#4a5568',
 },
 additionalDetails: {
   marginTop: 10,
   paddingTop: 10,
   borderTopWidth: 1,
   borderTopColor: '#eee',
 },
 detailText: {
   fontSize: 14,
   color: '#666',
   marginBottom: 5,
 },
 sellerDetails: {
   marginTop: 10,
   paddingTop: 10,
   borderTopWidth: 1,
   borderTopColor: '#eee',
 },
 sellerName: {
   fontSize: 14,
   color: '#4a5568',
   marginBottom: 3,
 },
 sellerPhone: {
   fontSize: 14,
   color: '#2c5282',
   fontWeight: '500',
 },
 errorText: {
   color: 'red',
   fontSize: 16,
   textAlign: 'center',
 },
 noDataText: {
   color: '#666',
   fontSize: 16,
   textAlign: 'center',
 },
 footer: {
   paddingVertical: 20,
   alignItems: 'center',
 },
});


export default ContactedProperty;