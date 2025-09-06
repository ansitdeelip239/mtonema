import {useMemo} from 'react';
import {SellerProperty} from '../../../types';

export const useDashboardAnalytics = (properties: SellerProperty[]) => {
  // Price Analytics
  const priceAnalytics = useMemo(() => {
    if (properties.length === 0) {
      return null;
    }

    const prices = properties.map(p => p.price || 0).filter(p => p > 0);
    if (prices.length === 0) {
      return null;
    }

    const avgPrice =
      prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);

    return {avgPrice, maxPrice, minPrice};
  }, [properties]);

  // Property Type Analytics
  const propertyTypeAnalytics = useMemo(() => {
    if (properties.length === 0) {
      return null;
    }

    const types = properties.reduce((acc, property) => {
      const type = property.propertyType || 'Other';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(types)
      .sort(([, a]: [string, number], [, b]: [string, number]) => b - a)
      .slice(0, 4);
  }, [properties]);

  // BHK Analytics
  const bhkAnalytics = useMemo(() => {
    if (properties.length === 0) {
      return null;
    }

    const bhkTypes = properties.reduce((acc, property) => {
      const bhk = property.bhkType || 'Not Specified';
      acc[bhk] = (acc[bhk] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(bhkTypes)
      .sort(([, a]: [string, number], [, b]: [string, number]) => b - a)
      .slice(0, 3);
  }, [properties]);

  // Monthly Insights
  const monthlyInsights = useMemo(() => {
    if (properties.length === 0) {
      return null;
    }

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const thisMonthProperties = properties.filter(property => {
      const createdDate = new Date(property.createdOn);
      return (
        createdDate.getMonth() === currentMonth &&
        createdDate.getFullYear() === currentYear
      );
    });

    const lastMonthProperties = properties.filter(property => {
      const createdDate = new Date(property.createdOn);
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const yearToCheck = currentMonth === 0 ? currentYear - 1 : currentYear;
      return (
        createdDate.getMonth() === lastMonth &&
        createdDate.getFullYear() === yearToCheck
      );
    });

    return {
      thisMonth: thisMonthProperties.length,
      lastMonth: lastMonthProperties.length,
      growth:
        lastMonthProperties.length > 0
          ? Math.round(
              ((thisMonthProperties.length - lastMonthProperties.length) /
                lastMonthProperties.length) *
                100,
            )
          : thisMonthProperties.length > 0
          ? 100
          : 0,
    };
  }, [properties]);

  // Ready to Move Stats
  const readyToMoveStats = useMemo(() => {
    if (properties.length === 0) {
      return null;
    }

    const readyToMoveCount = properties.filter(p => p.readyToMove).length;
    const underConstructionCount = properties.length - readyToMoveCount;

    return {
      readyToMove: readyToMoveCount,
      underConstruction: underConstructionCount,
      readyPercentage: Math.round((readyToMoveCount / properties.length) * 100),
    };
  }, [properties]);

  // Furnishing Distribution
  const furnishingStats = useMemo(() => {
    if (properties.length === 0) {
      return null;
    }

    const furnishing = properties.reduce((acc, property) => {
      const type = property.furnishing || 'Not Specified';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(furnishing)
      .sort(([, a]: [string, number], [, b]: [string, number]) => b - a)
      .slice(0, 3);
  }, [properties]);

  // Location Insights
  const locationInsights = useMemo(() => {
    if (properties.length === 0) {
      return null;
    }

    const locations = properties.reduce((acc, property) => {
      const location = property.location || 'Unknown';
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(locations)
      .sort(([, a]: [string, number], [, b]: [string, number]) => b - a)
      .slice(0, 3);
  }, [properties]);

  // Portfolio Value
  const portfolioValue = useMemo(() => {
    return properties.reduce(
      (total, property) => total + (property.price || 0),
      0,
    );
  }, [properties]);

  // Status Distribution
  const statusDistribution = useMemo(() => {
    const statuses = properties.reduce((acc, property) => {
      const status = property.recordstatus || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statuses);
  }, [properties]);

  return {
    priceAnalytics,
    propertyTypeAnalytics,
    bhkAnalytics,
    monthlyInsights,
    readyToMoveStats,
    furnishingStats,
    locationInsights,
    portfolioValue,
    statusDistribution,
  };
};
