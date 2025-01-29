import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {PostPropertyFormParamList} from './PostPropertyForm';
import {PropertyFormData} from '../../../types/propertyform';
import {SegmentedButtons, Text, Chip} from 'react-native-paper';
import {useMaster} from '../../../context/MasterProvider';
import {FlatList} from 'react-native-gesture-handler';
import Colors from '../../../constants/Colors';

type Props = NativeStackScreenProps<PostPropertyFormParamList, 'FormScreen2'>;

const FormScreen2: React.FC<Props> = ({navigation, route}) => {
  const [values, setValue] = useState('Property info');
  const {masterData} = useMaster();
  const [formData, setFormData] = useState(route.params.formData);
  const [showAll, setShowAll] = useState<{[key: string]: boolean}>({
    PropertyType: false,
    BhkType: false,
    Furnishing: false,
    Facing: false,
  });

  const initialChipsToShow = 2;

  const handleChipPress = (key: keyof PropertyFormData, value: string) => {
    setFormData(prevState => {
      const currentValue = prevState[key];
      if (currentValue === value) {
        return {...prevState, [key]: ''};
      } else {
        return {...prevState, [key]: value};
      }
    });
  };

  const handleTogglePress = (key: keyof PropertyFormData, value: string) => {
    setFormData(prevState => ({
      ...prevState,
      [key]: prevState[key] === value ? '' : value,
    }));
  };

  const renderToggleSection = (title: string, key: keyof PropertyFormData) => {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.toggleWrapper}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              formData[key] === 'Yes' && styles.selectedToggle,
            ]}
            onPress={() => handleTogglePress(key, 'Yes')}>
            <Text
              style={[
                styles.toggleText,
                formData[key] === 'Yes' && styles.selectedToggleText,
              ]}>
              Yes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              formData[key] === 'No' && styles.selectedToggle,
            ]}
            onPress={() => handleTogglePress(key, 'No')}>
            <Text
              style={[
                styles.toggleText,
                formData[key] === 'No' && styles.selectedToggleText,
              ]}>
              No
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const handleNext = () => navigation.navigate('FormScreen3', {formData});

  const renderChipSection = (
    title: string,
    key: keyof PropertyFormData,
    data: any[],
  ) => {
    const displayedChips = showAll[key]
      ? data
      : data.slice(0, initialChipsToShow);
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.gridWrapper}>
          {displayedChips?.map((item, index) => (
            <Chip
              key={index}
              onPress={() => handleChipPress(key, item.MasterDetailName)}
              style={[
                styles.chip,
                formData[key] === item.MasterDetailName && styles.selectedChip,
              ]}
              textStyle={
                formData[key] === item.MasterDetailName &&
                styles.selectedChipText
              }>
              {item.MasterDetailName}
            </Chip>
          ))}
          {data.length > initialChipsToShow && (
            <TouchableOpacity
              onPress={() => setShowAll(prev => ({...prev, [key]: !prev[key]}))}
              style={styles.moreButton}>
              <Text style={styles.moreButtonText}>
                {showAll[key] ? 'Less' : 'More'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('../../../assets/Images/bgimg1.png')}
      style={styles.background}>
      <View style={styles.mainheading}>
        <Text style={styles.mainheadingtext}>Property Information</Text>
      </View>
      <FlatList
        data={[1]}
        contentContainerStyle={styles.scrollContainer}
        ListHeaderComponent={
          <>
            <View style={styles.container}>
              <SegmentedButtons
                value={values}
                onValueChange={setValue}
                buttons={[
                  {
                    value: 'Basic Info',
                    label: 'Basic Info',
                    onPress: () => navigation.navigate('FormScreen1'),
                  },
                  {
                    value: 'Property info',
                    label: 'Property Info',
                    onPress: () =>
                      navigation.navigate('FormScreen2', {formData}),
                  },
                  {
                    value: 'Images',
                    label: 'Image Upload',
                    onPress: () =>
                      navigation.navigate('FormScreen3', {formData}),
                  },
                ]}
              />

              {renderChipSection(
                'Property Type',
                'PropertyType',
                masterData?.PropertyType || [],
              )}
              {renderChipSection(
                'BHK Type',
                'BhkType',
                masterData?.BhkType || [],
              )}

              {renderToggleSection('Ready To Move', 'readyToMove')}
              {renderToggleSection('Lift Available', 'Lifts')}
              {renderToggleSection('Pantry', 'Pantry')}

              {renderChipSection(
                'Furnishing Status',
                'Furnishing',
                masterData?.FurnishType || [],
              )}
              {renderChipSection(
                'Direction of Facing',
                'Facing',
                masterData?.Facing || [],
              )}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.touchableOpacity}
                onPress={handleNext}>
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        keyExtractor={(item, index) => index.toString()}
        renderItem={() => null}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  mainheading: {
    padding: 10,
    left: 10,
    top: 15,
    fontSize: 20,
    paddingBottom: 50,
  },
  mainheadingtext: {
    fontSize: 29,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableOpacity: {
    backgroundColor: Colors.main,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    padding: 15,
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  sectionContainer: {
    marginTop: 1,
    marginBottom: 1,
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  gridWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  toggleWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
  },
  toggleButton: {
    height: 50,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  selectedToggle: {
    backgroundColor: Colors.main,
    borderColor: Colors.main,
  },
  toggleText: {
    fontSize: 16,
    color: '#000',
  },
  selectedToggleText: {
    color: 'white',
  },
  chip: {
    margin: 4,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  selectedChip: {
    backgroundColor: Colors.main,
    borderColor: Colors.main,
  },
  selectedChipText: {
    color: 'white',
  },
  moreButton: {
    margin: 4,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  moreButtonText: {
    fontSize: 14,
    color: '#000',
  },
});

export default FormScreen2;
