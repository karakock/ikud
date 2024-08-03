import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import '../styles/UserProfile.css';

const UserProfile = () => {
  const { userId } = useParams();
  const { users, setUsers } = useContext(UserContext);
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const selectedUser = users.find(user => user.id.toString() === userId);
    if (selectedUser) {
      setUserInfo(selectedUser);
    }
  }, [userId, users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSave = () => {
    setUsers(prevUsers => prevUsers.map(user => user.id === userInfo.id ? userInfo : user));
    setEditMode(false);
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile-container">
      <h2>User Profile</h2>
      <div className="profile-info">
        <div className="profile-row">
          <label>Name:</label>
          {editMode ? (
            <input type="text" name="name" value={userInfo.name || ''} onChange={handleChange} />
          ) : (
            <span>{userInfo.name || 'Not specified'}</span>
          )}
        </div>
        <div className="profile-row">
          <label>Role:</label>
          {editMode ? (
            <select name="role" value={userInfo.role} onChange={handleChange}>
              <option value="Admin">Admin</option>
              <option value="Moderatör">Moderatör</option>
              <option value="Kullanıcı">Kullanıcı</option>
            </select>
          ) : (
            <span>{userInfo.role}</span>
          )}
        </div>
        {editMode && (
          <div className="profile-actions">
            <button className="save-button" onClick={handleSave}>Save</button>
            <button className="cancel-button" onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        )}
        {!editMode && (
          <button className="edit-button" onClick={() => setEditMode(true)}>Edit</button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
