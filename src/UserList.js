// C:\Users\ozcan\Documents\GitHub\ikud\src\UserList.js
import React, { useState, useEffect } from 'react';
import usersData from './users.json'; // JSON dosyasını projenin içinde import et

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // JSON dosyasından kullanıcıları yükleme
    setUsers(usersData);
  }, []);

  return (
    <div>
      <h1>Kullanıcı Listesi</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email} - {user.role} - {user.isActive ? 'Aktif' : 'Pasif'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
