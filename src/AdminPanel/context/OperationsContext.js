import React, { createContext, useState } from 'react';

export const OperationsContext = createContext();

export const OperationsProvider = ({ children }) => {
  const [operations, setOperations] = useState({});

  const updateOperations = (newOperations) => {
    setOperations(prevOperations => ({
      ...prevOperations,
      ...newOperations
    }));
  };

  const resetOperations = () => {
    setOperations({});
  };

  return (
    <OperationsContext.Provider value={{ operations, updateOperations, resetOperations }}>
      {children}
    </OperationsContext.Provider>
  );
};
