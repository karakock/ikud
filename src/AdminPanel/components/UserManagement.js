import React, { useState, useContext } from 'react';
import Notification from './Notification';
import '../styles/UserManagement.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const UserManagement = () => {
  const { users, setUsers, addUser, deleteUser, currentUser, setActiveStatus, setCurrentUser } = useContext(UserContext);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Kullanıcı', password: '' });
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      setNotification({ message: 'İsim, e-posta ve şifre gereklidir.', type: 'error' });
      return;
    }

    try {
      addUser(newUser);
      setNewUser({ name: '', email: '', role: 'Kullanıcı', password: '' });
      setNotification({ message: 'Kullanıcı başarıyla eklendi!', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Kullanıcı eklenirken hata oluştu.', type: 'error' });
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      deleteUser(userId);
      setNotification({ message: 'Kullanıcı başarıyla silindi!', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Kullanıcı silinirken hata oluştu.', type: 'error' });
    }
  };

  const handleResetUsers = () => {
    setUsers([]); // Kullanıcı listesini sıfırlar
    setNotification({ message: 'Kullanıcı listesi başarıyla sıfırlandı!', type: 'success' });
  };

  const handleEditUser = (user) => {
    navigate(`/admin/profile/${user.id}`);
  };

  const handleLogout = () => {
    if (currentUser) {
      setActiveStatus(currentUser.id, false);
      localStorage.removeItem('currentUser');
      setCurrentUser(null);
      navigate('/login');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-management-container">
      <h2>Kullanıcı Oluşturma</h2>
      <Notification message={notification.message} type={notification.type} />
      <div className="user-add-form">
        <div className="form-group">
          <label htmlFor="name">İsim</label>
          <input
            type="text"
            name="name"
            id="name"
            value={newUser.name}
            onChange={handleInputChange}
            placeholder="İsim"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">E-posta</label>
          <input
            type="email"
            name="email"
            id="email"
            value={newUser.email}
            onChange={handleInputChange}
            placeholder="E-posta"
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Rol</label>
          <select name="role" id="role" value={newUser.role} onChange={handleInputChange}>
            <option value="Admin">Admin</option>
            <option value="Moderatör">Moderatör</option>
            <option value="Kullanıcı">Kullanıcı</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="password">Şifre</label>
          <input
            type="password"
            name="password"
            id="password"
            value={newUser.password}
            onChange={handleInputChange}
            placeholder="Şifre"
          />
        </div>
        <button className="save-button" onClick={handleAddUser}>Kullanıcı Ekle</button>
        <button className="reset-button" onClick={handleResetUsers}>Kullanıcıları Sıfırla</button>
        <button className="logout-button" onClick={handleLogout}>Çıkış Yap</button>
      </div>
      <input
        type="text"
        placeholder="Kullanıcı Ara..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>İsim</th>
            <th>E-posta</th>
            <th>Rol</th>
            <th>Durum</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <span className={user.isActive ? 'status-active' : 'status-inactive'}>
                  {user.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </td>
              <td>
                <button className="edit-button" onClick={() => handleEditUser(user)}>Düzenle</button>
                {currentUser.role === 'Admin' && (
                  <button className="delete-button" onClick={() => handleDeleteUser(user.id)}>Sil</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
