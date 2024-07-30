import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('currentUser')));

  const apiUrl = process.env.NODE_ENV === 'production' 
    ? 'https://ikudfiyat.org.tr/users' 
    : 'http://localhost:54977/users';

  const setActiveStatus = useCallback(async (userId, status) => {
    try {
      await axios.patch(`${apiUrl}/${userId}`, { isActive: status });
      setUsers(prevUsers => prevUsers.map(user => user.id === userId ? { ...user, isActive: status } : user));
    } catch (error) {
      console.error('Aktif durum ayarlanırken hata:', error.message);
    }
  }, [apiUrl]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(apiUrl);
        setUsers(response.data);
      } catch (error) {
        console.error('Kullanıcıları çekerken hata:', error.message);
        if (error.response) {
          console.error('Sunucu durumu:', error.response.status);
          console.error('Yanıt verisi:', error.response.data);
        } else if (error.request) {
          console.error('Yanıt alınamadı:', error.request);
        } else {
          console.error('İstek kurulurken hata:', error.message);
        }
      }
    };

    fetchUsers();
  }, [apiUrl]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      setActiveStatus(currentUser.id, true);
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser, setActiveStatus]);

  const addUser = async (newUser) => {
    try {
      const response = await axios.post(apiUrl, newUser);
      setUsers(prevUsers => [...prevUsers, response.data]);
    } catch (error) {
      console.error('Kullanıcı eklenirken hata:', error.message);
      if (error.response) {
        console.error('Sunucu durumu:', error.response.status);
        console.error('Yanıt verisi:', error.response.data);
      } else if (error.request) {
        console.error('Yanıt alınamadı:', error.request);
      } else {
        console.error('İstek kurulurken hata:', error.message);
      }
    }
  };

  return (
    <UserContext.Provider value={{ users, setUsers, currentUser, setCurrentUser, addUser, setActiveStatus }}>
      {children}
    </UserContext.Provider>
  );
};
