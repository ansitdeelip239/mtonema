import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Text,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import useForm from '../hooks/useForm';
import {MaterialTextInput} from './MaterialTextInput';
import {Button} from 'react-native-paper';
import {ProfileFormData} from '../schema/ProfileFormSchema';
import GetIcon from './GetIcon';
import Images from '../constants/Images';
import AuthService from '../services/AuthService';
import CommonService from '../services/CommonService';
import Colors from '../constants/Colors';
import {useKeyboard} from '../hooks/useKeyboard';
// import {useLogoStorage} from '../hooks/useLogoStorage';
import {useTheme} from '../context/ThemeProvider';
import {useSubscription} from '../context/SubscriptionProvider';
import { useAuth } from '../context/AuthProvider';

const EditProfileComponent = () => {
  const [editingFields, setEditingFields] = useState<
    Record<keyof ProfileFormData, boolean>
  >({
    name: false,
    email: false,
    location: false,
    phone: false,
  });
  const [profileUpdated, setProfileUpdated] = useState(false);
  const {user, storeUser} = useAuth();
  const {keyboardVisible} = useKeyboard();
  const {
    subscriptionStatus,
    isLoadingSubscription,
    hasActiveSubscription,
    isInTrial,
    isActivePaidSubscription,
    isPartnerOrTeam,
  } = useSubscription();
  const scrollViewRef = useRef<ScrollView>(null);
  // const {logoUrl} = useLogoStorage();
  const {theme} = useTheme();

  const {formInput, handleInputChange, loading, onSubmit, setFormInput} =
    useForm<ProfileFormData>({
      initialState: {
        name: '',
        email: '',
        location: '',
        phone: '',
      },
      onSubmit: async formData => {
        try {
          const requestBody = {
            id: user?.id as number,
            name: formData.name,
            email: formData.email,
            location: formData.location,
            phone: formData.phone,
            recordStatus: user?.recordStatus,
          };

          const response = await CommonService.updateProfile(requestBody);
          if (response.httpStatus === 200) {
            console.log('Profile updated successfully');
            // storeUser(response.data);
            // setUser(response.data);
            setProfileUpdated(prev => !prev);
            if (user) {
              storeUser({
                ...user,
                name: requestBody.name,
                email: requestBody.email,
                phone: requestBody.phone,
                location: requestBody.location,
              });
            }
          }
          setEditingFields({
            name: false,
            email: false,
            location: false,
            phone: false,
          });
        } catch (error) {
          console.error('Error submitting form:', error);
        }
      },
    });

  const toggleEdit = (field: keyof ProfileFormData) => {
    setEditingFields(prev => {
      const newEditingFields = {
        ...prev,
        [field]: !prev[field],
      };

      if (newEditingFields[field]) {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({animated: true});
        }, 300);
      }

      return newEditingFields;
    });
  };

  const isAnyFieldEditing = Object.values(editingFields).some(value => value);

  const formatDate = (dateString: string) => {
    if (!dateString) {
      return 'N/A';
    }
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getSubscriptionStatusText = () => {
    if (!subscriptionStatus) {
      return 'Loading...';
    }

    if (hasActiveSubscription) {
      // Check for active trial first
      if (isInTrial) {
        return 'Active Trial';
      }
      // Then check for active paid subscription
      else if (isActivePaidSubscription) {
        return `Active (${subscriptionStatus?.orderStatus?.planName})`;
      }
      // If hasActiveSubscription is true but neither trial nor order is active, show general active
      return 'Active';
    }

    return 'Inactive';
  };

  const getSubscriptionColor = () => {
    if (!subscriptionStatus) {
      return '#666';
    }
    return hasActiveSubscription ? '#53a20e' : '#ff6b6b';
  };

  // Effect to scroll to the end when keyboard appears
  useEffect(() => {
    if (keyboardVisible && isAnyFieldEditing) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({animated: true});
      }, 300);
    }
  }, [keyboardVisible, isAnyFieldEditing]);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const token = await AuthService.getToken();
        const response = await AuthService.getUserByToken(token as string);

        setFormInput(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    }

    fetchProfileData();
  }, [setFormInput, profileUpdated]);

  // Get screen dimensions to calculate appropriate padding
  const screenHeight = Dimensions.get('window').height;

  // Determine which field is being edited to provide appropriate padding
  const getAdaptivePadding = () => {
    if (editingFields.phone) {
      return screenHeight * 0.05; // 5% for phone field
    }

    if (editingFields.location) {
      return screenHeight * 0.04; // 4% for location field
    }

    if (editingFields.email) {
      return screenHeight * 0.02; // 2% for email field
    }

    // Minimal padding for the name field at the top
    return screenHeight * 0.01; // 1% for name field
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 40}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <View style={styles.profileImageContainer}>
              {/* {logoUrl ? (
                <Image source={{uri: logoUrl}} style={styles.profileImage} />
              ) : ( */}
              <Image
                source={Images.MTESTATES_LOGO}
                style={styles.profileImage}
              />
              {/* )} */}
            </View>

            {/* Subscription Status Section - Only for Partners and Team Members */}
            {isPartnerOrTeam && Platform.OS !== 'ios' && (
              <View style={styles.subscriptionContainer}>
                <Text style={styles.subscriptionTitle}>
                  Subscription Status
                </Text>

                {isLoadingSubscription ? (
                  <Text style={styles.subscriptionLoading}>Loading...</Text>
                ) : subscriptionStatus ? (
                  <View style={styles.subscriptionDetails}>
                    <View style={styles.statusRow}>
                      <Text style={styles.statusLabel}>Status:</Text>
                      <Text
                        style={[
                          styles.statusValue,
                          {color: getSubscriptionColor()},
                        ]}>
                        {getSubscriptionStatusText()}
                      </Text>
                    </View>

                    {hasActiveSubscription && (
                      <>
                        {/* Trial Information */}
                        {isInTrial && (
                          <>
                            <View style={styles.statusRow}>
                              <Text style={styles.statusLabel}>
                                Trial Start:
                              </Text>
                              <Text style={styles.statusValue}>
                                {formatDate(
                                  subscriptionStatus.trialStatus.trialStartDate,
                                )}
                              </Text>
                            </View>
                            <View style={styles.statusRow}>
                              <Text style={styles.statusLabel}>Trial End:</Text>
                              <Text style={styles.statusValue}>
                                {formatDate(
                                  subscriptionStatus.trialStatus.trialEndDate,
                                )}
                              </Text>
                            </View>
                            <View style={styles.statusRow}>
                              <Text style={styles.statusLabel}>
                                Trial Days Left:
                              </Text>
                              <Text style={styles.statusValue}>
                                {subscriptionStatus.trialDaysLeft} days
                              </Text>
                            </View>
                            {!subscriptionStatus.trialStatus
                              .convertedToPaid && (
                              <View style={styles.statusRow}>
                                <Text style={styles.statusLabel}>
                                  Converted to Paid:
                                </Text>
                                <Text style={styles.statusValue}>
                                  {subscriptionStatus.trialStatus
                                    .convertedToPaid
                                    ? 'Yes'
                                    : 'No'}
                                </Text>
                              </View>
                            )}
                          </>
                        )}

                        {/* Paid Subscription Information */}
                        {isActivePaidSubscription && (
                          <>
                            <View style={styles.statusRow}>
                              <Text style={styles.statusLabel}>Plan:</Text>
                              <Text style={styles.statusValue}>
                                {subscriptionStatus.orderStatus.planName}
                              </Text>
                            </View>
                            <View style={styles.statusRow}>
                              <Text style={styles.statusLabel}>Billing:</Text>
                              <Text style={styles.statusValue}>
                                {subscriptionStatus.orderStatus.billingCycle}
                              </Text>
                            </View>
                            <View style={styles.statusRow}>
                              <Text style={styles.statusLabel}>
                                Start Date:
                              </Text>
                              <Text style={styles.statusValue}>
                                {formatDate(
                                  subscriptionStatus.orderStatus.startDate,
                                )}
                              </Text>
                            </View>
                            <View style={styles.statusRow}>
                              <Text style={styles.statusLabel}>End Date:</Text>
                              <Text style={styles.statusValue}>
                                {formatDate(
                                  subscriptionStatus.orderStatus.endDate,
                                )}
                              </Text>
                            </View>
                            <View style={styles.statusRow}>
                              <Text style={styles.statusLabel}>
                                Days Remaining:
                              </Text>
                              <Text style={styles.statusValue}>
                                {subscriptionStatus.orderStatus.remainingDays}{' '}
                                days
                              </Text>
                            </View>
                          </>
                        )}

                        {/* Pending Order Information (when user is in trial but has pending payment) */}
                        {subscriptionStatus.orderStatus?.status?.toLowerCase() ===
                          'pending' &&
                          subscriptionStatus.trialStatus?.trialStatus?.toLowerCase() ===
                            'active' && (
                            <>
                              <View style={styles.statusRow}>
                                <Text style={styles.statusLabel}>
                                  Pending Plan:
                                </Text>
                                <Text style={styles.statusValue}>
                                  {subscriptionStatus.orderStatus.planName}
                                </Text>
                              </View>
                              <View style={styles.statusRow}>
                                <Text style={styles.statusLabel}>
                                  Payment Status:
                                </Text>
                                <Text
                                  style={[
                                    styles.statusValue,
                                    styles.pendingStatus,
                                  ]}>
                                  {subscriptionStatus.orderStatus.paymentStatus}
                                </Text>
                              </View>
                              <View style={styles.statusRow}>
                                <Text style={styles.statusLabel}>Amount:</Text>
                                <Text style={styles.statusValue}>
                                  ₹
                                  {(
                                    subscriptionStatus.orderStatus.amount / 100
                                  ).toFixed(2)}
                                </Text>
                              </View>
                            </>
                          )}
                      </>
                    )}
                  </View>
                ) : (
                  <Text style={styles.subscriptionError}>
                    Failed to load subscription status
                  </Text>
                )}
              </View>
            )}
            <MaterialTextInput
              field="name"
              formInput={formInput}
              setFormInput={handleInputChange}
              label="Name"
              mode="outlined"
              disabled={!editingFields.name}
              rightComponent={
                <TouchableOpacity onPress={() => toggleEdit('name')}>
                  <GetIcon
                    iconName={editingFields.name ? 'clear' : 'edit'}
                    size="24"
                  />
                </TouchableOpacity>
              }
              theme={{
                colors: {
                  placeholder: !editingFields.name ? 'black' : '#666666',
                },
              }}
            />

            <MaterialTextInput
              field="email"
              formInput={formInput}
              setFormInput={handleInputChange}
              label="Email"
              mode="outlined"
              disabled={!editingFields.email}
              keyboardType="email-address"
              rightComponent={
                <TouchableOpacity onPress={() => toggleEdit('email')}>
                  <GetIcon
                    iconName={editingFields.email ? 'clear' : 'edit'}
                    size="24"
                  />
                </TouchableOpacity>
              }
            />

            <MaterialTextInput
              field="location"
              formInput={formInput}
              setFormInput={handleInputChange}
              label="Location"
              mode="outlined"
              disabled={!editingFields.location}
              rightComponent={
                <TouchableOpacity onPress={() => toggleEdit('location')}>
                  <GetIcon
                    iconName={editingFields.location ? 'clear' : 'edit'}
                    size="24"
                  />
                </TouchableOpacity>
              }
            />

            <MaterialTextInput
              field="phone"
              formInput={formInput}
              setFormInput={handleInputChange}
              label="Phone"
              mode="outlined"
              disabled={!editingFields.phone}
              keyboardType="phone-pad"
              rightComponent={
                <TouchableOpacity onPress={() => toggleEdit('phone')}>
                  <GetIcon
                    iconName={editingFields.phone ? 'clear' : 'edit'}
                    size="24"
                  />
                </TouchableOpacity>
              }
            />

            {isAnyFieldEditing && (
              <Button
                mode="contained"
                onPress={onSubmit}
                loading={loading}
                textColor={Colors.white}
                style={[
                  styles.submitButton,
                  {backgroundColor: theme.primaryColor},
                ]}>
                Save Changes
              </Button>
            )}

            {/* Adaptive padding based on which field is being edited */}
            {keyboardVisible && <View style={{height: getAdaptivePadding()}} />}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    padding: 16,
    gap: 16,
  },
  submitButton: {
    marginTop: 16,
  },
  profileImageContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  profileImage: {
    // width: 160,
    maxWidth: 300,
    // height: 160,
    maxHeight: 160,
    alignSelf: 'center',
    borderRadius: 0,
    resizeMode: 'cover',
  },
  bottomPadding: {
    height: 150,
  },
  subscriptionContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subscriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  subscriptionLoading: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 10,
  },
  subscriptionError: {
    fontSize: 14,
    color: '#ff6b6b',
    textAlign: 'center',
    paddingVertical: 10,
  },
  subscriptionDetails: {
    gap: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  statusValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  pendingStatus: {
    color: '#ff9500',
  },
});

export default EditProfileComponent;
