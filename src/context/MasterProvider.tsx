import React, {useState, useEffect, useCallback, createContext} from 'react';
import MasterService from '../services/MasterService';
import {MasterDetailModel} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';

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
  PartnerLocation: MasterDetailModel[];
}

interface MasterContextProps {
  masterData: MasterData | null;
  reloadMasterData: () => void;
  isLoading: boolean;
  dataSource: 'cache' | 'api' | 'cache-updated' | null;
}

const MasterContext = createContext<MasterContextProps | undefined>(undefined);

// Key for storing master data in AsyncStorage
const MASTER_DATA_KEY = 'masterData';

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
  'ImageType',
  'PartnerLocation',
];

export const MasterProvider: React.FC<MasterProviderProps> = ({children}) => {
  const [masterData, setMasterData] = useState<MasterData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<
    'cache' | 'api' | 'cache-updated' | null
  >(null);
  const [_isSyncingInBackground, setIsSyncingInBackground] = useState(false);

  // Function to save master data to AsyncStorage
  const cacheMasterData = useCallback(async (data: MasterData) => {
    try {
      await AsyncStorage.setItem(MASTER_DATA_KEY, JSON.stringify(data));
      console.log('✅ Master data successfully cached to AsyncStorage');
    } catch (error) {
      console.error('❌ Failed to cache master data:', error);
    }
  }, []);

  // Function to load master data from AsyncStorage
  const loadCachedMasterData = useCallback(async () => {
    try {
      console.log('🔍 Checking for cached master data...');
      const cachedData = await AsyncStorage.getItem(MASTER_DATA_KEY);

      if (!cachedData) {
        console.log('⚠️ No cached master data found');
        return null;
      }

      console.log('✅ Cached master data found!');
      return JSON.parse(cachedData) as MasterData;
    } catch (error) {
      console.error('❌ Error loading cached master data:', error);
      return null;
    }
  }, []);

  // Function to fetch master data from API
  const fetchMasterDataFromApi = useCallback(async () => {
    try {
      console.log('🌐 Fetching master data from API...');

      const newMasterData: Partial<MasterData> = {};
      await Promise.all(
        masterName.map(async master => {
          const response = await MasterService.getMasterDetails(master);
          newMasterData[master as keyof MasterData] = response.data;
        }),
      );

      const completeMasterData = newMasterData as MasterData;
      console.log('✅ Master data successfully fetched from API');
      return completeMasterData;
    } catch (error) {
      console.error('❌ Failed to fetch master data from API:', error);
      return null;
    }
  }, []);

  // Function to compare cached data with API data
  const compareAndUpdateData = useCallback(
    async (cachedData: MasterData) => {
      try {
        setIsSyncingInBackground(true);
        console.log('🔄 Starting background sync of master data...');

        // Fetch fresh data from API
        const apiData = await fetchMasterDataFromApi();

        if (!apiData) {
          console.log('⚠️ Background sync failed - could not fetch API data');
          return;
        }

        // Compare cached data with API data
        const isDataEqual = _.isEqual(cachedData, apiData);

        if (isDataEqual) {
          console.log('✓ Cache is up to date with API data');
        } else {
          console.log('🔄 API data differs from cache, updating...');

          // Update state and cache
          setMasterData(apiData);
          await cacheMasterData(apiData);
          setDataSource('cache-updated');

          console.log('✅ Master data updated from background sync');
        }
      } catch (error) {
        console.error('❌ Error during background sync:', error);
      } finally {
        setIsSyncingInBackground(false);
      }
    },
    [fetchMasterDataFromApi, cacheMasterData],
  );

  // Main function to load master data - uses cache first, then syncs with API
  const loadMasterData = useCallback(async () => {
    setIsLoading(true);

    try {
      // Try to load from cache first
      const cachedData = await loadCachedMasterData();

      if (cachedData) {
        // Use cached data immediately for fast UI rendering
        setMasterData(cachedData);
        setDataSource('cache');
        console.log('📦 Using cached master data for immediate display');
        setIsLoading(false);

        // Then start background sync
        compareAndUpdateData(cachedData);
      } else {
        // No cache available - fetch from API
        console.log('🔄 No cache available, fetching from API...');
        const apiData = await fetchMasterDataFromApi();

        if (apiData) {
          setMasterData(apiData);
          await cacheMasterData(apiData);
          setDataSource('api');
        }

        setIsLoading(false);
      }
    } catch (error) {
      console.error('❌ Error in loadMasterData:', error);
      setIsLoading(false);
    }
  }, [
    loadCachedMasterData,
    fetchMasterDataFromApi,
    cacheMasterData,
    compareAndUpdateData,
  ]);

  // Force reload from API and update cache
  const reloadMasterData = useCallback(async () => {
    console.log('🔄 Forcing master data reload from API...');
    setIsLoading(true);

    try {
      const apiData = await fetchMasterDataFromApi();

      if (apiData) {
        setMasterData(apiData);
        await cacheMasterData(apiData);
        setDataSource('api');
      }
    } catch (error) {
      console.error('❌ Error during forced reload:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchMasterDataFromApi, cacheMasterData]);

  // Load master data on initial mount
  useEffect(() => {
    loadMasterData();
  }, [loadMasterData]);

  const contextValue = {
    masterData,
    reloadMasterData,
    isLoading,
    dataSource,
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
