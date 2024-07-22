import React from 'react';
import '../styles/AdminPanel.css';

const AdminHeader = ({ handleLogout, toggleNotificationMenu, notificationOpen }) => {
  return (
    <div className="admin-header">
      <div className="admin-header-left">
        <h1>Yönetim Paneli</h1>
      </div>
      <div className="admin-header-right">
        <div className="notification-icon" onClick={toggleNotificationMenu}>
          <i className="fas fa-bell fa-icon"></i>
          <span className="badge">3</span>
        </div>
        <div className={`notification-menu ${notificationOpen ? 'open' : ''}`}>
          <div className="notification-item">Yeni bir kullanıcı kaydoldu.</div>
          <div className="notification-item">Bir fiyat güncellemesi yapıldı.</div>
          <div className="notification-item">Yeni bir bildirim var.</div>
        </div>
        <span>Hoşgeldiniz, Admin</span>
        
        <button onClick={handleLogout}><i className="fas fa-sign-out-alt fa-icon"></i>Çıkış Yap</button>
      </div>
    </div>
  );
};

export default AdminHeader;
