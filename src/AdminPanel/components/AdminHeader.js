import React from 'react';
import '../styles/AdminPanel.css';

const AdminHeader = ({ handleLogout, toggleNotificationMenu, notificationOpen, toggleDarkMode, currentUser }) => {
  const getRoleLabel = () => {
    switch (currentUser.role) {
      case 'Admin':
        return 'Admin';
      case 'Moderatör':
        return 'Moderatör';
      default:
        return 'Üye';
    }
  };

  return (
    <div className="admin-header">
      <div className="admin-header-left">
        <h1>Yönetim Paneli</h1>
      </div>
      <div className="admin-header-right">
        <div className="dark-mode-toggle" onClick={toggleDarkMode}>
          <i className="fas fa-moon fa-icon"></i>
        </div>
        <div className="notification-icon" onClick={toggleNotificationMenu}>
          <i className="fas fa-bell fa-icon"></i>
          <span className="badge">3</span>
        </div>
        <div className={`notification-menu ${notificationOpen ? 'open' : ''}`}>
          <div className="notification-item">Yeni bir kullanıcı kaydoldu.</div>
          <div className="notification-item">Bir fiyat güncellemesi yapıldı.</div>
          <div className="notification-item">Yeni bir bildirim var.</div>
        </div>
        <div className="user-profile">
          <span>Hoşgeldiniz, {getRoleLabel()}</span>
          <img src="https://via.placeholder.com/40" alt="User Avatar" className="user-avatar" />
        </div>
        <button onClick={handleLogout}><i className="fas fa-sign-out-alt fa-icon"></i>Çıkış Yap</button>
      </div>
    </div>
  );
};

export default AdminHeader;
