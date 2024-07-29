import React, { useEffect, useState } from 'react';
import '../styles/AdminPanel.css';

const AdminHeader = ({ handleLogout, toggleNotificationMenu, notificationOpen, toggleDarkMode, currentUser }) => {
  const [newRequest, setNewRequest] = useState(false);
  const [priceUpdate, setPriceUpdate] = useState(false);
  const [marqueeUpdate, setMarqueeUpdate] = useState(false);

  useEffect(() => {
    const newRequestNotification = localStorage.getItem('newRequestNotification');
    const priceUpdateNotification = localStorage.getItem('priceUpdateNotification');
    const marqueeUpdateNotification = localStorage.getItem('marqueeUpdateNotification');

    if (newRequestNotification === 'true') {
      setNewRequest(true);
    }
    if (priceUpdateNotification === 'true') {
      setPriceUpdate(true);
    }
    if (marqueeUpdateNotification === 'true') {
      setMarqueeUpdate(true);
    }
  }, []);

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

  const clearNotification = (type) => {
    if (type === 'newRequest') {
      setNewRequest(false);
      localStorage.removeItem('newRequestNotification');
    } else if (type === 'priceUpdate') {
      setPriceUpdate(false);
      localStorage.removeItem('priceUpdateNotification');
    } else if (type === 'marqueeUpdate') {
      setMarqueeUpdate(false);
      localStorage.removeItem('marqueeUpdateNotification');
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
          {(newRequest || priceUpdate || marqueeUpdate) && <span className="badge">!</span>}
        </div>
        <div className={`notification-menu ${notificationOpen ? 'open' : ''}`}>
          {newRequest && <div className="notification-item" onClick={() => clearNotification('newRequest')}>Yeni bir kullanıcı başvurusu var.</div>}
          {priceUpdate && <div className="notification-item" onClick={() => clearNotification('priceUpdate')}>Bir fiyat güncellemesi yapıldı.</div>}
          {marqueeUpdate && <div className="notification-item" onClick={() => clearNotification('marqueeUpdate')}>Kayan yazı güncellendi.</div>}
        </div>
        <div className="user-profile">
          <span>Hoşgeldiniz, {getRoleLabel()}</span>
          <img src="/src/img/3541871.png" alt="" className="user-avatar" />
        </div>
        <button onClick={handleLogout}><i className="fas fa-sign-out-alt fa-icon"></i>Çıkış Yap</button>
      </div>
    </div>
  );
};

export default AdminHeader;
