import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Text, Card} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../../../components/Header';
import GetIcon from '../../../../components/GetIcon';
import { TeamStackParamList } from '../../../../navigator/components/TeamStack';

type Props = NativeStackScreenProps<TeamStackParamList, 'Add Teams Screen'>;

const AddTeamScreen: React.FC<Props> = ({navigation}) => {
  const { t } = useTranslation();

  const handleWebsiteAccess = () => {
    Alert.alert(
      'Feature Available on Web',
      'Adding team members is available through our web platform. Please visit our website to add and manage team members.',
      [{text: 'OK'}],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
        {Platform.OS === 'android' && (
          <Header
            title={t('teams.headers.addMember', 'Add Team Member')}
            backButton
            onBackPress={() => navigation.goBack()}
          />
        )}
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContentContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <Card style={styles.webFeatureCard}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.webFeatureIcon}>
                  <GetIcon iconName="about" size={48} color="#6366f1" />
                </View>
                
                <Text style={styles.webFeatureTitle}>
                  Team Management Available on Web
                </Text>
                
                <Text style={styles.webFeatureDescription}>
                  Adding and managing team members is a premium feature available through our web platform.
                </Text>
                
                <View style={styles.featureList}>
                  <View style={styles.featureItem}>
                    <GetIcon iconName="about" size={20} color="#10b981" />
                    <Text style={styles.featureText}>Add unlimited team members</Text>
                  </View>
                  
                  <View style={styles.featureItem}>
                    <GetIcon iconName="about" size={20} color="#10b981" />
                    <Text style={styles.featureText}>Edit member details</Text>
                  </View>
                  
                  <View style={styles.featureItem}>
                    <GetIcon iconName="about" size={20} color="#10b981" />
                    <Text style={styles.featureText}>Manage permissions</Text>
                  </View>
                  
                  <View style={styles.featureItem}>
                    <GetIcon iconName="about" size={20} color="#10b981" />
                    <Text style={styles.featureText}>Track team activity</Text>
                  </View>
                </View>

                <View style={styles.webPlatformNotice}>
                  <Text style={styles.webNoticeTitle}>How to Access</Text>
                  <Text style={styles.webNoticeText}>
                    Visit our web platform to access full team management features and add new team members to your account.
                  </Text>
                </View>
              </Card.Content>
            </Card>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}>
                <GetIcon iconName="back" size={20} color="#64748b" />
                <Text style={styles.backButtonText}>
                  {t('common.actions.back', 'Back')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.webAccessButton}
                onPress={handleWebsiteAccess}
                activeOpacity={0.7}>
                <Text style={styles.webAccessButtonText}>
                  Access Web Platform
                </Text>
                <GetIcon iconName="about" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

      </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  innerContainer: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    padding: 16,
  },
  webFeatureCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
    lineHeight: 20,
  },
  webFeatureIcon: {
    alignItems: 'center',
    marginBottom: 20,
  },
  webFeatureTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a202c',
    textAlign: 'center',
    marginBottom: 12,
  },
  webFeatureDescription: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  featureList: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingLeft: 8,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    fontWeight: '500',
  },
  webPlatformNotice: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  webNoticeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0369a1',
    marginBottom: 8,
  },
  webNoticeText: {
    fontSize: 14,
    color: '#0c4a6e',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    paddingHorizontal: 4,
  },
  backButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#64748b',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    marginLeft: 8,
  },
  webAccessButton: {
    flex: 2,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  webAccessButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginRight: 8,
  },
});

export default AddTeamScreen;