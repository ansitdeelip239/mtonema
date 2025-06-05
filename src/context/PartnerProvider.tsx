import React, {useState, useEffect, useCallback, createContext} from 'react';
import PartnerService from '../services/PartnerService';
import {Group} from '../types';
import {useAuth} from '../hooks/useAuth';
import {MasterDetailModel} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMaster} from './MasterProvider';

interface PartnerProviderProps {
  children: React.ReactNode;
}

interface PartnerContextProps {
  groups: Group[];
  reloadGroups: () => void;
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  dataUpdated: boolean;
  setDataUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  clientsUpdated: boolean;
  setClientsUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  agentPropertyUpdated: boolean;
  setAgentPropertyUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  partnerPropertyUpdated: boolean;
  setPartnerPropertyUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  messageTemplateUpdated: boolean;
  setMessageTemplateUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  cities: MasterDetailModel[];
  fetchProjectLocations: () => Promise<void>;
}

const PartnerContext = createContext<PartnerContextProps | undefined>(
  undefined,
);

export const PartnerProvider: React.FC<PartnerProviderProps> = ({children}) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [cities, setCities] = useState<MasterDetailModel[]>([]);
  const {user} = useAuth();
  const {fetchMasterDetailsByMasterNameAndXref} = useMaster();


  const [dataUpdated, setDataUpdated] = useState(false);
  const [clientsUpdated, setClientsUpdated] = useState(false);
  const [agentPropertyUpdated, setAgentPropertyUpdated] = useState(false);
  const [partnerPropertyUpdated, setPartnerPropertyUpdated] = useState(false);
  const [messageTemplateUpdated, setMessageTemplateUpdated] = useState(false);

  const fetchGroups = useCallback(async () => {
    try {
      const response = await PartnerService.getGroups(user?.email as string);
      setGroups(response.data.groups);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  }, [user?.email]);

  const fetchProjectLocations = useCallback(async () => {
    try {
      const partnerZoneData = await AsyncStorage.getItem('partnerZone');
      if (partnerZoneData) {
        const parsedData = JSON.parse(partnerZoneData);
        const response = await fetchMasterDetailsByMasterNameAndXref(
          'ProjectLocation',
          parsedData.masterName,
        );
        console.log(
          'Project locations response from PartnerProvider:',
          response,
          parsedData,
        );

        if (response.success) {
          setCities(response.data);
        } else {
          console.error(
            'Failed to fetch project locations in PartnerProvider:',
            response.message,
          );
          setCities([]); // Set to empty array on failure
        }
      } else {
        console.log('No partnerZone data found in AsyncStorage.');
        setCities([]); // Set to empty array if no zone data
      }
    } catch (error) {
      console.error(
        'Error fetching project locations in PartnerProvider:',
        error,
      );
      setCities([]); // Set to empty array on error
    }
  }, [fetchMasterDetailsByMasterNameAndXref]);

  useEffect(() => {
    fetchGroups();
    fetchProjectLocations(); // Call on mount
  }, [fetchGroups, fetchProjectLocations]);

  const reloadGroups = useCallback(() => {
    fetchGroups();
  }, [fetchGroups]);

  const contextValue = {
    groups,
    reloadGroups,
    setGroups,
    dataUpdated,
    setDataUpdated,
    clientsUpdated,
    setClientsUpdated,
    agentPropertyUpdated,
    setAgentPropertyUpdated,
    partnerPropertyUpdated,
    setPartnerPropertyUpdated,
    messageTemplateUpdated,
    setMessageTemplateUpdated,
    cities,
    fetchProjectLocations,
  };

  return (
    <PartnerContext.Provider value={contextValue}>
      {children}
    </PartnerContext.Provider>
  );
};

export const usePartner = () => {
  const context = React.useContext(PartnerContext);
  if (context === undefined) {
    throw new Error('usePartner must be used within a PartnerProvider');
  }
  return context;
};
