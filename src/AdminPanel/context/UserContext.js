import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('currentUser')));

  const apiUrl = process.env.NODE_ENV === 'production' 
  ? 'http://stildunyasi.site:5001/users' // Canlı sunucu adresiniz
  : 'http://localhost:5001/users';


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(apiUrl, { timeout: 5000 });
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error('API yanıtı bir dizi değil:', response.data);
        }
      } catch (error) {
        console.error('Kullanıcıları çekerken hata oluştu:', error.message);
        if (error.response) {
          console.error('Sunucu durumu:', error.response.status);
          console.error('Yanıt verisi:', error.response.data);
        } else if (error.request) {
          console.error('Yanıt alınamadı:', error.request);
        } else {
          console.error('İstek hatası:', error.message);
        }
      }
    };
  
    fetchUsers();
  }, [apiUrl]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const addUser = async (newUser) => {
    try {
      const response = await axios.post(apiUrl, newUser);
      setUsers((prevUsers) => [...prevUsers, response.data]);
    } catch (error) {
      console.error('Error adding user:', error.message);
      if (error.response) {
        console.error('Server responded with a status:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up the request:', error.message);
      }
    }
  };

  const setActiveStatus = async (id, status) => {
    try {
      const updatedUsers = users.map(user =>
        user.id === id ? { ...user, isActive: status } : user
      );
      setUsers(updatedUsers);
      // Sunucuya PUT isteği yaparak kullanıcı durumunu güncelleyebilirsiniz
      await axios.put(`${apiUrl}/${id}`, { isActive: status });
    } catch (error) {
      console.error('Error updating user status:', error.message);
    }
  };

  return (
    <UserContext.Provider value={{ users, setUsers, currentUser, setCurrentUser, addUser, setActiveStatus }}>
      {children}
    </UserContext.Provider>
  );
};
