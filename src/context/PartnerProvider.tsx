import React, {useState, useEffect, useCallback, createContext} from 'react';
import PartnerService from '../services/PartnerService';
import {Group} from '../types';
import {useAuth} from '../hooks/useAuth';

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
}

const PartnerContext = createContext<PartnerContextProps | undefined>(
  undefined,
);

export const PartnerProvider: React.FC<PartnerProviderProps> = ({children}) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [clientsUpdated, setClientsUpdated] = useState(false);
  const [agentPropertyUpdated, setAgentPropertyUpdated] = useState(false);
  const {user} = useAuth();

  const fetchGroups = useCallback(async () => {
    try {
      const response = await PartnerService.getGroups(user?.Email as string);
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  }, [user?.Email]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

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
