import React, {createContext, useContext, useState, useEffect} from 'react';
import {PropertyFormData} from '../types/propertyform';
import {loadFormData, saveFormData} from '../utils/asyncStoragePropertyForm';
import {useAuth} from '../hooks/useAuth';
import {PropertyModel} from '../types';

interface PropertyFormContextType {
  formData: PropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
  updateFormField: <K extends keyof PropertyFormData>(
    field: K,
    value: PropertyFormData[K],
  ) => void;
  resetForm: () => void;
  isFormValid: (step: number) => boolean;
  editPropertyData: (property: PropertyModel) => void;
  isEditMode: boolean;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const PropertyFormContext = createContext<PropertyFormContextType | undefined>(
  undefined,
);

export const PropertyFormProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const {user} = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData>({
    AlarmSystem: null,
    ApprovedBy: '',
    Area: null,
    BhkType: null,
    BoundaryWall: null,
    CeilingHeight: null,
    City: null,
    ConstructionDone: null,
    Country: null,
    CreatedBy: null,
    Discription: null,
    Facing: null,
    Furnishing: null,
    GatedSecurity: null,
    ImageURL: [],
    ImageURLType: [],
    IsFeatured: false,
    Lifts: null,
    Location: null,
    OpenSide: null,
    Pantry: null,
    Parking: null,
    Price: null,
    PropertyAge: null,
    PropertyFor: null,
    PropertyForType: null,
    PropertyType: null,
    Rate: null,
    SellerEmail: user?.Email || '',
    SellerName: user?.Name || '',
    SellerPhone: user?.Phone || '',
    SellerType: null,
    ShortDiscription: null,
    Size: null,
    State: null,
    Status: null,
    SurveillanceCameras: null,
    Tag: null,
    Tags: [],
    UserId: user?.ID.toString() || '',
    VideoURL: null,
    ZipCode: null,
    CarParking: null,
    floor: null,
    locality: null,
    otherCity: null,
    readyToMove: null,
    statusText: null,
    video: null,
  });

  useEffect(() => {
    const loadSavedData = async () => {
      const savedData = await loadFormData();
      if (savedData) {
        setFormData(prev => ({...prev, ...savedData}));
      }
    };
    loadSavedData();
  }, []);

  useEffect(() => {
    saveFormData(formData);
  }, [formData]);

  const updateFormField = <K extends keyof PropertyFormData>(
    field: K,
    value: PropertyFormData[K],
  ) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const editPropertyData = (property: PropertyModel) => {
    setIsEditMode(true);
    setFormData(
      prev =>
        ({
          ...prev,
          ID: property.ID?.toString() || '', // Convert ID to string
          AlarmSystem: property.AlarmSystem || null,
          ApprovedBy: property.ApprovedBy || '',
          Area: typeof property.Area === 'number' ? property.Area : null,
          BhkType: property.BhkType?.ID || null,
          City: property.City?.ID || null,
          Discription: property.Discription || null,
          Facing: property.Facing?.ID || null,
          Furnishing: property.Furnishing?.ID,
          ImageURL: Array.isArray(property.ImageURL) ? property.ImageURL : [],
          ImageURLType: Array.isArray(property.ImageURLType)
            ? property.ImageURLType
            : [],
          Location: property.Location,
          PropertyFor: property.PropertyFor?.ID || null,
          PropertyType: property.PropertyType?.ID || null,
          Rate: property.Rate?.ID || null,
          SellerEmail: property.SellerEmail || '',
          SellerName: property.SellerName || '',
          SellerPhone: property.SellerPhone || '',
          SellerType: property.SellerType?.ID || null,
          UserId: property.UserId?.toString() || user?.ID?.toString() || '',
          readyToMove:property.readyToMove,
          Lifts:property.Lifts || null,
          Pantry:property.Pantry || null,
          floor:property.floor || null,
          Parking: property.Parking?.toString() || null,
          ZipCode:property.ZipCode || null,
          PropertyForType:property.PropertyForType || null,
          Price: property.Price?.toString() || null,
          locality: property.Locality || null,
          Status: property.Status || null,
          Tags: Array.isArray(property.Tags) ? property.Tags : [],
          PropertyAge:property.PropertyAge || null,
          GatedSecurity:property.GatedSecurity || null,
          SurveillanceCameras:property.SurveillanceCameras || null,
          ConstructionDone:property.ConstructionDone || null,
          BoundaryWall:property.BoundaryWall || null,
          OpenSide:property.OpenSide || null,
          CeilingHeight:property.CeilingHeight || null,
        } as PropertyFormData),
    );
  };


  const resetForm = () => {
    setIsEditMode(false);
    setFormData({
      AlarmSystem: null,
      ApprovedBy: '',
      Area: null,
      BhkType: null,
      BoundaryWall: null,
      CeilingHeight: null,
      City: null,
      ConstructionDone: null,
      Country: null,
      CreatedBy: null,
      Discription: null,
      Facing: null,
      Furnishing: null,
      GatedSecurity: null,
      ImageURL: [],
      ImageURLType: [],
      IsFeatured: false,
      Lifts: null,
      Location: null,
      OpenSide: null,
      Pantry: null,
      Parking: null,
      Price: null,
      PropertyAge: null,
      PropertyFor: null,
      PropertyForType: null,
      PropertyType: null,
      Rate: null,
      SellerEmail: user?.Email || '',
      SellerName: user?.Name || '',
      SellerPhone: user?.Phone || '',
      SellerType: null,
      ShortDiscription: null,
      Size: null,
      State: null,
      Status: null,
      SurveillanceCameras: null,
      Tag: null,
      Tags: [],
      UserId: user?.ID.toString() || '',
      VideoURL: null,
      ZipCode: null,
      CarParking: null,
      floor: null,
      locality: null,
      otherCity: null,
      readyToMove: null,
      statusText: null,
      video: null,
    });
  };

  useEffect(() => {
    console.log('formData', formData);
  }, [formData]);

  const isFormValid = (step: number) => {
    switch (step) {
      case 1:
        return (
         
          formData.City !== null &&
          formData.PropertyFor !== null
        );
      case 2:
        return (
          formData.PropertyType !== null &&
          formData.Price !== null &&
          formData.Area !== null &&
          formData.BhkType !== null &&
          formData.Discription !== null
        );
      case 3:
        return formData.ImageURL?.length > 0;
      default:
        return false;
    }
  };

  return (
    <PropertyFormContext.Provider
      value={{
        formData,
        setFormData,
        updateFormField,
        resetForm,
        isFormValid,
        editPropertyData,
        isEditMode,
        setIsEditMode,
      }}>
      {children}
    </PropertyFormContext.Provider>
  );
};

export const usePropertyForm = () => {
  const context = useContext(PropertyFormContext);
  if (!context) {
    throw new Error('usePropertyForm must be used within PropertyFormProvider');
  }
  return context;
};
