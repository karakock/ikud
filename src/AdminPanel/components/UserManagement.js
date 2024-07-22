import React, { useState, useContext } from 'react';
import Notification from './Notification';
import '../styles/UserManagement.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';

const UserManagement = () => {
  const { users, setUsers, addUser } = useContext(UserContext);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Kullanıcı', password: '' });
  const [notification, setNotification] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      setNotification({ message: 'Name, email, and password are required.', type: 'error' });
      return;
    }

    try {
      await addUser(newUser);
      setNewUser({ name: '', email: '', role: 'Kullanıcı', password: '' });
      setNotification({ message: 'User added successfully!', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Error adding user', type: 'error' });
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
      setNotification({ message: 'User deleted successfully!', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Error deleting user', type: 'error' });
    }
  };

  const handleEditUser = (user) => {
    navigate(`/admin/profile/${user.id}`);
  };

  return (
    <div className="user-management-container">
      <h2>Kullanıcı Oluşturma</h2>
      <Notification message={notification.message} type={notification.type} />
      <div className="user-add-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={newUser.name}
            onChange={handleInputChange}
            placeholder="Name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={newUser.email}
            onChange={handleInputChange}
            placeholder="Email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select name="role" id="role" value={newUser.role} onChange={handleInputChange}>
            <option value="Admin">Admin</option>
            <option value="Moderatör">Moderatör</option>
            <option value="Kullanıcı">Kullanıcı</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={newUser.password}
            onChange={handleInputChange}
            placeholder="Password"
          />
        </div>
        <button className="save-button" onClick={handleAddUser}>Add User</button>
      </div>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button className="edit-button" onClick={() => handleEditUser(user)}>Edit</button>
                <button className="delete-button" onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
