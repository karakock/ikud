import React, { useContext, useEffect, useState } from 'react';
import { Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import Settings from './Settings';
import PriceUpdateForm from './PriceUpdateForm';
import UserManagement from './UserManagement';
import PendingRequests from './PendingRequests';
import PriceTable from '../../components/PriceTable';
import UserProfile from './UserProfile';
import MarqueeSettings from './MarqueeSettings';
import SlideManagement from './SlideManagement';
import ManageAyarSettings from './ManageAyarSettings';
import { UserContext } from '../context/UserContext';
import { SlideProvider } from '../context/SlideContext';
import { OperationsContext } from '../context/OperationsContext';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';
import '../styles/AdminPanel.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const AdminPanel = ({ marqueeText, setMarqueeText, scrollAmount, setScrollAmount, onSaveMarqueeSettings, symbols, show18Ayar, setShow18Ayar, show14Ayar, setShow14Ayar }) => {
  const { currentUser, setCurrentUser, setActiveStatus } = useContext(UserContext);
  const { operations } = useContext(OperationsContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'currentUser' && !event.newValue) {
        setCurrentUser(null);
        navigate('/login');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [setCurrentUser, navigate]);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const handleLogout = async () => {
    setActiveStatus(false); // Logout sırasında aktif durumu false yapıyoruz
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleNotificationMenu = () => {
    setNotificationOpen(!notificationOpen);
  };

  const closeNotificationMenu = () => {
    setNotificationOpen(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  return (
    <SlideProvider>
      <div className={`admin-panel ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <AdminHeader 
          handleLogout={handleLogout} 
          toggleNotificationMenu={toggleNotificationMenu} 
          notificationOpen={notificationOpen} 
          toggleDarkMode={toggleDarkMode}
          currentUser={currentUser}
        />
        <div className={`admin-panel-sidebar ${sidebarOpen ? 'collapsed' : ''}`}>
          <ul>
            <li><Link to="/admin"><i className="fas fa-tachometer-alt fa-icon"></i>YÖNETİM PANELİ</Link></li>
            <li><Link to="/"><i className="fas fa-home fa-icon"></i>Ana Sayfa</Link></li>
            {currentUser.role === 'Admin' && (
              <>
                <li>
                  <button onClick={toggleSidebar}><i className="fas fa-dollar-sign fa-icon"></i>Fiyat Güncelleme</button>
                  <div className={`submenu ${sidebarOpen ? 'open' : ''}`}>
                    <Link to="/admin/price-update"><i className="fas fa-dollar-sign fa-icon"></i>Fiyat Güncelleme</Link>
                    <Link to="/admin/price-table"><i className="fas fa-table fa-icon"></i>Fiyat Tablosu</Link>
                  </div>
                </li>
                <li><Link to="/admin/user-management"><i className="fas fa-users fa-icon"></i>Kullanıcı Yönetimi</Link></li>
                <li><Link to="/admin/marquee-settings"><i className="fas fa-newspaper fa-icon"></i>Kayan Yazı</Link></li>
                <li><Link to="/admin/slide-management"><i className="fas fa-images fa-icon"></i>Slayt Yönetimi</Link></li>
                <li><Link to="/admin/manage-ayar-settings"><i className="fas fa-cogs fa-icon"></i>Ayarları Yönet</Link></li>
                <li><Link to="/admin/pending-requests"><i className="fas fa-user-clock fa-icon"></i>Bekleyen Üyelik Talepleri</Link></li>
              </>
            )}
            {currentUser.role === 'Moderatör' && (
              <li><Link to="/admin/price-update"><i className="fas fa-dollar-sign fa-icon"></i>Fiyat Güncelleme</Link></li>
            )}
            <li><button onClick={handleLogout}><i className="fas fa-sign-out-alt fa-icon"></i>Çıkış Yap</button></li>
          </ul>
        </div>
        <div className="admin-panel-content" onClick={closeNotificationMenu}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="profile/:userId" element={<UserProfile />} />
            {currentUser.role === 'Admin' && (
              <>
                <Route path="settings" element={<Settings />} />
                <Route path="price-update" element={<PriceUpdateForm />} />
                <Route path="user-management" element={<UserManagement />} />
                <Route path="marquee-settings" element={<MarqueeSettings marqueeText={marqueeText} setMarqueeText={setMarqueeText} scrollAmount={scrollAmount} setScrollAmount={setScrollAmount} onSave={onSaveMarqueeSettings} />} />
                <Route path="slide-management" element={<SlideManagement />} />
                <Route path="manage-ayar-settings" element={<ManageAyarSettings show18Ayar={show18Ayar} setShow18Ayar={setShow18Ayar} show14Ayar={show14Ayar} setShow14Ayar={setShow14Ayar} />} />
                <Route path="pending-requests" element={<PendingRequests />} />
              </>
            )}
            {currentUser.role === 'Moderatör' && (
              <Route path="price-update" element={<PriceUpdateForm />} />
            )}
          </Routes>
          <PriceTable 
            marqueeText={marqueeText} 
            scrollAmount={scrollAmount} 
            symbols={symbols} 
            operations={operations}
            show18Ayar={show18Ayar}
            show14Ayar={show14Ayar}
          />
        </div>
        <AdminFooter />
      </div>
    </SlideProvider>
  );
};

export default AdminPanel;
