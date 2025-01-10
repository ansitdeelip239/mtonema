import React, { useState, useEffect, useCallback, createContext } from 'react';
import MasterService from '../services/MasterService';


interface MasterProviderProps {
  children: React.ReactNode;
}

interface MasterData {
  // Define the structure of your master data here
  [key: string]: any;
}

interface MasterContextProps {
  masterData: MasterData | null;
  reloadMasterData: () => void;
}

const MasterContext = createContext<MasterContextProps | undefined>(undefined);
const masterName=['PropertyType','SellerType','PropertyFor','ImageType','BhkType','ProjectLocation','AmountUnit','AreaUnit','FurnishType','Facing'];
export const MasterProvider: React.FC<MasterProviderProps> = ({ children }) => {
  const [masterData, setMasterData] = useState<MasterData | null>(null);

  const fetchMasterData = useCallback(async () => {
    try {
      // const PropertyTypeResponse = await MasterService.getMasterDetails('PropertyType');
      // const SellerTypeResponse = await MasterService.getMasterDetails('SellerType');
      // const PropertyForResponse = await MasterService.getMasterDetails('PropertyFor');
      // const ImageTypeResponse = await MasterService.getMasterDetails('ImageType');
      // const BhkTypeResponse = await MasterService.getMasterDetails('BhkType');
      // const ProjectLocationResponse = await MasterService.getMasterDetails('Project Location');
      masterName.map(async (master)=>{
        const response = await MasterService.getMasterDetails(master);
        setMasterData((prevData) => ({
          ...prevData,
          [master]: response.data,
        }));
      })
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
