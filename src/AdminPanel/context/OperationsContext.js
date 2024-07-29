import React, { createContext, useState } from 'react';

export const OperationsContext = createContext();

export const OperationsProvider = ({ children }) => {
  const [operations, setOperations] = useState(() => {
    const savedOperations = localStorage.getItem('operations');
    return savedOperations ? JSON.parse(savedOperations) : {};
  });

  const updateOperations = (newOperations) => {
    setOperations(prevOperations => {
      const updatedOperations = { ...prevOperations, ...newOperations };
      localStorage.setItem('operations', JSON.stringify(updatedOperations));
      localStorage.setItem('priceUpdateNotification', 'true'); // Fiyat güncelleme bildirimi
      return updatedOperations;
    });
  };

  const resetOperations = () => {
    setOperations({});
    localStorage.removeItem('operations');
  };

  return (
    <OperationsContext.Provider value={{ operations, updateOperations, resetOperations }}>
      {children}
    </OperationsContext.Provider>
  );
};

export default OperationsProvider;
