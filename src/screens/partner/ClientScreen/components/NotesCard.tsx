import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { parseHtmlToText } from '../../../../utils/parseHtmlToText';

interface NotesCardProps {
  notes?: string;
}

const NotesCard: React.FC<NotesCardProps> = ({notes}) => {
  if (!notes) {
    return null;
  }

  const parsedNotes = parseHtmlToText(notes);

  return (
    <View style={styles.infoCard}>
      <Text style={styles.sectionTitle}>Notes</Text>
      <Text style={styles.notesText}>{parsedNotes}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  notesText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
});

export default NotesCard;
