import {useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMaster} from '../context/MasterProvider';
import {MasterDetailModel} from '../types';

const LOGO_URL_KEY = 'logoUrl';

interface LogoData {
  imageUrl?: string;
  name?: string;
  domain?: string;
}

export const useLogoStorage = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [partnerName, setPartnerName] = useState<string | null>(null);
  const [partnerDomain, setPartnerDomain] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Import master data context
  const {masterData} = useMaster();

  const storeLogoData = useCallback(async (data: LogoData): Promise<void> => {
    try {
      if (!data) {
        console.warn('Attempted to store empty logo data');
        return;
      }

      // Store the full data object as JSON string
      await AsyncStorage.setItem(LOGO_URL_KEY, JSON.stringify(data));

      // Update state
      if (data.imageUrl) {
        setLogoUrl(data.imageUrl);
      }
      if (data.name) {
        setPartnerName(data.name);
      }
      if (data.domain) {
        setPartnerDomain(data.domain);
      }
    } catch (storageError) {
      console.error('Failed to store logo data:', storageError);
      setError(
        storageError instanceof Error ? storageError : new Error('Failed to store logo data'),
      );
      throw storageError;
    }
  }, []);

  const clearLogoData = useCallback(async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(LOGO_URL_KEY);
      setLogoUrl(null);
      setPartnerName(null);
      setPartnerDomain(null);
    } catch (clearError) {
      console.error('Failed to clear logo data:', clearError);
      setError(
        clearError instanceof Error ? clearError : new Error('Failed to clear logo data'),
      );
      throw clearError;
    }
  }, []);

  const getLogoData = useCallback(async (): Promise<LogoData | null> => {
    try {
      const data = await AsyncStorage.getItem(LOGO_URL_KEY);
      if (!data) {
        return null;
      }

      return JSON.parse(data) as LogoData;
    } catch (retrievalError) {
      console.error('Failed to retrieve logo data:', retrievalError);
      setError(
        retrievalError instanceof Error
          ? retrievalError
          : new Error('Failed to retrieve logo data'),
      );
      throw retrievalError;
    }
  }, []);

  const extractLogoFromPartnerLocation = useCallback(
    async (partnerLocationId: number): Promise<LogoData | null> => {
      try {
        if (!masterData || !masterData.PartnerLocation) {
          console.warn('Master data not available yet');
          return null;
        }

        // Find the matching location in master data
        const partnerLocation = masterData.PartnerLocation.find(
          (location: MasterDetailModel) => location.id === partnerLocationId,
        );

        if (!partnerLocation || !partnerLocation.description) {
          console.warn(
            `Partner location ${partnerLocationId} not found or has no description`,
          );
          return null;
        }

        try {
          // Parse the JSON description
          const parsedData = JSON.parse(
            partnerLocation.description,
          ) as LogoData;

          // Store the parsed data
          await storeLogoData(parsedData);

          return parsedData;
        } catch (parseError) {
          console.error('Error parsing partner location data:', parseError);
          return null;
        }
      } catch (extractError) {
        console.error('Error extracting logo from partner location:', extractError);
        setError(
          extractError instanceof Error
            ? extractError
            : new Error('Error extracting logo data'),
        );
        return null;
      }
    },
    [masterData, storeLogoData],
  );

  const getLogoFromLocationName = useCallback(
    async (locationName: string): Promise<LogoData | null> => {
      try {
        if (!masterData || !masterData.PartnerLocation) {
          console.warn('Master data not available yet');
          return null;
        }

        const location = masterData.PartnerLocation.find(
          loc => loc.masterDetailName === locationName,
        );

        if (!location || !location.description) {
          return null;
        }

        try {
          const parsedData = JSON.parse(location.description) as LogoData;
          await storeLogoData(parsedData);
          return parsedData;
        } catch (parseError) {
          console.error('Error parsing location data:', parseError);
          return null;
        }
      } catch (err) {
        console.error('Error getting logo from location name:', err);
        return null;
      }
    },
    [masterData, storeLogoData],
  );

  // Load logo data from AsyncStorage on initial mount
  useEffect(() => {
    const loadLogoData = async () => {
      try {
        setIsLoading(true);
        const data = await getLogoData();

        if (data) {
          if (data.imageUrl) {
            setLogoUrl(data.imageUrl);
          }
          if (data.name) {
            setPartnerName(data.name);
          }
          if (data.domain) {
            setPartnerDomain(data.domain);
          }
        }

        setError(null);
      } catch (loadError) {
        console.error('Error in useLogoStorage useEffect:', loadError);
      } finally {
        setIsLoading(false);
      }
    };

    loadLogoData();
  }, [getLogoData]);

  return {
    // State
    logoUrl,
    partnerName,
    partnerDomain,
    isLoading,
    error,

    // Methods
    storeLogoData,
    clearLogoData,
    getLogoData,
    extractLogoFromPartnerLocation,
    getLogoFromLocationName,
  };
};
