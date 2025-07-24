import React, { createContext, useContext, useState } from 'react';

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState({
    propertyCount: 0,
    requirementCount: 0,
    amenityCount: 0,
    packageCount: 0,
    subscriberCount: 0,
    customerCount: 0,
  });

  const updateDashboardData = (newData) => {
    setDashboardData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  return (
    <DashboardContext.Provider value={{ dashboardData, updateDashboardData }}>
      {children}
    </DashboardContext.Provider>
  );
};
