import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useCallback} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ContentTemplateStackParamList} from '../../../navigator/components/ContentTemplateStack';
import Header from '../../../components/Header';
import {PartnerDrawerParamList} from '../../../types/navigation';
import {useTheme} from '../../../context/ThemeProvider';
import {useAuth} from '../../../hooks/useAuth';
import {useDialog} from '../../../hooks/useDialog';
import GetIcon from '../../../components/GetIcon';
import Toast from 'react-native-toast-message';
import PartnerService from '../../../services/PartnerService';

type Props = NativeStackScreenProps<
  ContentTemplateStackParamList,
  'AddContentTempleteScreen'
>;

const AddContentScreen: React.FC<Props> = ({navigation}) => {
  const {theme} = useTheme();
  const {user} = useAuth();
  const {showError} = useDialog();

  const [templateName, setTemplateName] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  // Insert variable at cursor position
  const insertVariable = useCallback((variable: string) => {
    setContent(prevContent => prevContent + variable);
  }, []);

  const handleSave = useCallback(async () => {
    if (!templateName.trim()) {
      showError('Please enter a template name');
      return;
    }

    if (!content.trim()) {
      showError('Please enter template content');
      return;
    }

    if (!user?.id) {
      showError('User not found');
      return;
    }

    try {
      setSaving(true);

      // TODO: Add the actual API call for creating content template
      // const response = await PartnerService.createContentTemplate({
      //   name: templateName.trim(),
      //   content: content.trim(),
      //   userId: user.id,
      // });o

      // Simulate API call for now

      const response = await PartnerService.createContentTemplate(user.id, {
        name: templateName.trim(),
        content: content.trim(),
      });

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Template Created',
          text2: 'Your message template has been saved successfully.',
        });
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error creating template:', error);
      showError('Failed to create template');
    } finally {
      setSaving(false);
    }
  }, [templateName, content, user?.id, showError, navigation]);

  const handleCancel = useCallback(() => {
    if (templateName.trim() || content.trim()) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to discard your changes?',
        [
          {text: 'Continue Editing', style: 'cancel'},
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } else {
      navigation.goBack();
    }
  }, [templateName, content, navigation]);

  // Available variables
  const variables = [
    {id: 'name', variable: '{name}', description: 'Client name'},
    {id: 'phone', variable: '{phone}', description: 'Phone number'},
    {id: 'email', variable: '{email}', description: 'Email address'},
    {id: 'sender_name', variable: '{sender_name}', description: 'Your name'},
    {id: 'company', variable: '{company}', description: 'Company name'},
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header<PartnerDrawerParamList>
        title="Add Message Template"
        backButton={true}
        onBackPress={handleCancel}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Template Name Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Template Name *</Text>
          <TextInput
            style={styles.nameInput}
            value={templateName}
            onChangeText={setTemplateName}
            placeholder="Enter template name"
            placeholderTextColor="#999"
            maxLength={100}
          />
          <Text style={styles.helperText}>
            Give your template a descriptive name
          </Text>
        </View>

        {/* Content Editor */}
        <View style={styles.section}>
          <Text style={styles.label}>Message Content *</Text>
          <TextInput
            style={styles.contentInput}
            value={content}
            onChangeText={setContent}
            placeholder={
              'Type your message template here...\n\nYou can use variables like {name}, {phone}, {email} to personalize messages.'
            }
            placeholderTextColor="#999"
            multiline
            textAlignVertical="top"
            scrollEnabled
          />
          <Text style={styles.helperText}>
            Variables in curly braces will be replaced with actual values when
            sending messages.
          </Text>
        </View>

        {/* Template Variables */}
        <View style={styles.section}>
          <Text style={styles.label}>Available Variables</Text>
          <Text style={[styles.helperText, styles.variablesDescription]}>
            Tap on any variable below to add it to your message
          </Text>
          <View style={styles.variablesContainer}>
            {variables.map(variable => (
              <TouchableOpacity
                key={variable.id}
                style={styles.variableChip}
                onPress={() => insertVariable(variable.variable)}
                activeOpacity={0.7}>
                <Text style={styles.variableText}>{variable.variable}</Text>
                <Text style={styles.variableDescription}>
                  {variable.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.helperText}>
            These variables will be automatically replaced when sending messages
          </Text>
        </View>

        {/* Preview Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Preview</Text>
          <View style={styles.previewContainer}>
            <Text style={styles.previewText}>
              {content || 'Your message preview will appear here...'}
            </Text>
          </View>
        </View>

        {/* Bottom spacing for buttons */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
          disabled={saving}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.saveButton,
            {backgroundColor: theme.primaryColor},
            saving && styles.savingButton,
          ]}
          onPress={handleSave}
          disabled={saving}>
          {saving ? (
            <>
              <ActivityIndicator size="small" color="white" />
              <Text style={styles.saveButtonText}>Saving...</Text>
            </>
          ) : (
            <>
              <GetIcon iconName="checkmark" size={16} color="white" />
              <Text style={styles.saveButtonText}>Save Template</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  nameInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  contentInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 16,
    fontSize: 16,
    color: '#333',
    minHeight: 200,
    maxHeight: 300,
    lineHeight: 24,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    lineHeight: 16,
  },
  variablesDescription: {
    marginBottom: 12,
    fontStyle: 'italic',
  },
  variablesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  variableChip: {
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b3d9ff',
    minWidth: 120,
    alignItems: 'center',
  },
  variableText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0066cc',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  variableDescription: {
    fontSize: 10,
    color: '#0066cc',
    textAlign: 'center',
  },
  previewContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 16,
    minHeight: 100,
  },
  previewText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 100,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  savingButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default AddContentScreen;
