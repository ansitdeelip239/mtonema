import React, {useState, useEffect, useCallback, createContext} from 'react';
import MasterService from '../services/MasterService';
import {MasterDetailModel} from '../types';

interface MasterProviderProps {
  children: React.ReactNode;
}

interface MasterData {
  PropertyType: MasterDetailModel[];
  SellerType: MasterDetailModel[];
  PropertyFor: MasterDetailModel[];
  ImageType: MasterDetailModel[];
  BhkType: MasterDetailModel[];
  ProjectLocation: MasterDetailModel[];
  AmountUnit: MasterDetailModel[];
  AreaUnit: MasterDetailModel[];
  FurnishType: MasterDetailModel[];
  Facing: MasterDetailModel[];
  AgentPropertyType: MasterDetailModel[];
  ActivityType: MasterDetailModel[];
  GroupColor: MasterDetailModel[];
}

interface MasterContextProps {
  masterData: MasterData | null;
  reloadMasterData: () => void;
}

const MasterContext = createContext<MasterContextProps | undefined>(undefined);

const masterName = [
  'PropertyType',
  'SellerType',
  'PropertyFor',
  'ImageType',
  'BhkType',
  'ProjectLocation',
  'AmountUnit',
  'AreaUnit',
  'FurnishType',
  'Facing',
  'AgentPropertyType',
  'ActivityType',
  'GroupColor',
];

export const MasterProvider: React.FC<MasterProviderProps> = ({children}) => {
  const [masterData, setMasterData] = useState<MasterData | null>(null);

  const fetchMasterData = useCallback(async () => {
    try {
      const newMasterData: Partial<MasterData> = {};
      await Promise.all(
        masterName.map(async master => {
          const response = await MasterService.getMasterDetails(master);
          newMasterData[master as keyof MasterData] = response.data;
        }),
      );
      setMasterData(newMasterData as MasterData);
    } catch (error) {
      console.error('Failed to fetch master data:', error);
    }
  }, []);

  useEffect(() => {
    fetchMasterData();
  }, [fetchMasterData]);

  const reloadMasterData = useCallback(() => {
    fetchMasterData();
  }, [fetchMasterData]);

  const contextValue = {
    masterData,
    reloadMasterData,
  };

  return (
    <MasterContext.Provider value={contextValue}>
      {children}
    </MasterContext.Provider>
  );
};

export const useMaster = () => {
  const context = React.useContext(MasterContext);
  if (context === undefined) {
    throw new Error('useMaster must be used within a MasterProvider');
  }
  return context;
};
