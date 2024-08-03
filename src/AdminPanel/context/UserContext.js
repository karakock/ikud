import React, { createContext, useState, useEffect, useContext } from 'react';

// users.json yerine localStorage ile çalışacak şekilde ayarlandı
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('currentUser')));

  useEffect(() => {
    // localStorage'dan kullanıcıları yükle
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(storedUsers);
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const addUser = (newUser) => {
    try {
      const updatedUsers = [...users, { ...newUser, id: users.length + 1 }];
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers)); // localStorage'a kaydet
    } catch (error) {
      console.error('Error adding user:', error.message);
    }
  };

  const deleteUser = (userId) => {
    try {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers)); // localStorage'a kaydet
    } catch (error) {
      console.error('Error deleting user:', error.message);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    // Diğer logout işlemleri buraya eklenebilir
  };

  const setActiveStatus = (userId, isActive) => {
    try {
      const updatedUsers = users.map(user =>
        user.id === userId ? { ...user, isActive: isActive } : user
      );
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers)); // localStorage'a kaydet
    } catch (error) {
      console.error('Error updating user status:', error.message);
    }
  };

  return (
    <UserContext.Provider value={{ users, setUsers, currentUser, setCurrentUser, addUser, deleteUser, handleLogout, setActiveStatus }}>
      {children}
    </UserContext.Provider>
  );
};

// Kullanım örneği:
export const SomeComponent = () => {
  const { currentUser, handleLogout } = useContext(UserContext);

  return (
    <div>
      {currentUser ? (
        <>
          <p>Welcome, {currentUser.name}!</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Please log in.</p>
      )}
    </div>
  );
};
