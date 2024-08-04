import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users'));
    
    if (storedUsers && storedUsers.length > 0) {
      setUsers(storedUsers);
    } else {
      fetch('/users.json')
        .then(response => response.json())
        .then(data => {
          setUsers(data);
          localStorage.setItem('users', JSON.stringify(data));
        })
        .catch(error => console.error('Error loading users:', error.message));
    }
  }, []);

  const setActiveStatus = (userId, isActive) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, isActive: isActive } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const addUser = (newUser) => {
    const updatedUsers = [...users, { ...newUser, id: users.length + 1, isActive: false }];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const deleteUser = (userId) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  return (
    <UserContext.Provider value={{ users, setUsers, currentUser, setCurrentUser, setActiveStatus, addUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};
