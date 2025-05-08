import React from 'react';
import {ScrollView, View, StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

interface FormStepContainerProps {
  scrollViewRef: (ref: ScrollView | null) => void;
  children: React.ReactNode;
}

const FormStepContainer: React.FC<FormStepContainerProps> = ({
  scrollViewRef,
  children,
}) => {
  return (
    <View style={styles.stepContainer}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.stepWrapper}>{children}</View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    width: width,
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  stepWrapper: {
    padding: 20,
  },
});

export default FormStepContainer;
