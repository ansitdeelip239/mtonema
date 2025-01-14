import React, {useState, useEffect, useCallback, createContext} from 'react';
import BuyerService from '../services/BuyerService';
interface BuyerProviderProps {
  children: React.ReactNode;
}

interface BuyerData {
  recommendedProperties: any[];
  totalCount?: number;
}

interface BuyerContextProps {
  buyerData: BuyerData | null;
  reloadBuyerData: () => void;
}

const BuyerContext = createContext<BuyerContextProps | undefined>(undefined);

export const BuyerProvider: React.FC<BuyerProviderProps> = ({children}) => {
  const [buyerData, setBuyerData] = useState<BuyerData | null>(null);

  const fetchBuyerData = useCallback(async () => {
    try {
      const response = await BuyerService.RecommendedProperty(1, 10);
      const recommendedProperties = response.data?.propertyModels || [];
      const totalCount = response.data?.responsePagingModel.TotalCount || 0;
      setBuyerData({
        recommendedProperties,
        totalCount,
      });
    } catch (error) {
      console.error('Failed to fetch buyer data:', error);
    }
  }, []);

  useEffect(() => {
    fetchBuyerData();
  }, [fetchBuyerData]);

  const reloadBuyerData = useCallback(() => {
    fetchBuyerData();
  }, [fetchBuyerData]);

  const contextValue = {
    buyerData,
    reloadBuyerData,
  };

  return (
    <BuyerContext.Provider value={contextValue}>
      {children}
    </BuyerContext.Provider>
  );
};

export const useBuyer = () => {
  const context = React.useContext(BuyerContext);
  if (context === undefined) {
    throw new Error('useBuyer must be used within a BuyerProvider');
  }
  return context;
};
