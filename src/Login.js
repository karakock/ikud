import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';
import { UserContext } from './AdminPanel/context/UserContext';
import kudiImage from './img/kudi.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { users, currentUser, setCurrentUser, setActiveStatus } = useContext(UserContext);

  useEffect(() => {
    // Eğer currentUser mevcutsa admin sayfasına yönlendir
    if (currentUser) {
      navigate('/admin', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Hata mesajını temizleyin
    const user = users.find((u) => u.name.toLowerCase() === username.toLowerCase() && u.password === password);

    if (user) {
      if (!user.isActive || !currentUser) {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user)); // Kullanıcıyı yerel depolamaya kaydedin
        await setActiveStatus(user.id, true);
        navigate('/admin', { replace: true }); // Kullanıcıyı yönlendirirken replace kullanın
      } else {
        setError('Kullanıcı zaten başka bir oturumda açık.');
      }
    } else {
      setError('Geçersiz kullanıcı adı veya şifre');
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-box">
          <img src={kudiImage} alt="Kudi Logo" className="login-logo" />
          <h2>Giriş</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username" // Autocomplete özelliği eklendi
                placeholder="Kullanıcı Adı"
              />
              <label>Kullanıcı Adı</label>
            </div>
            <div className="form-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password" // Autocomplete özelliği eklendi
                placeholder="Şifre"
              />
              <label>Şifre</label>
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="login-button">Giriş Yap</button>
            <button type="button" className="signup-button" onClick={() => navigate('/signup')}>Üyelik İste</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
