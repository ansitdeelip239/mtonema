import React, {createContext, useContext, useState} from 'react';

type BottomTabContextType = {
  isTabBarHidden: boolean;
  hideBottomTabs: () => void;
  showBottomTabs: () => void;
};

const BottomTabContext = createContext<BottomTabContextType | undefined>(
  undefined,
);

export const useBottomTab = () => {
  const context = useContext(BottomTabContext);
  if (!context) {
    throw new Error('useBottomTab must be used within a BottomTabProvider');
  }
  return context;
};

export const BottomTabProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [isTabBarHidden, setIsTabBarHidden] = useState(false);

  const hideBottomTabs = () => {
    setIsTabBarHidden(true);
  };

  const showBottomTabs = () => {
    setIsTabBarHidden(false);
  };

  return (
    <BottomTabContext.Provider
      value={{isTabBarHidden, hideBottomTabs, showBottomTabs}}>
      {children}
    </BottomTabContext.Provider>
  );
};
