import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';
import { UserContext } from './AdminPanel/context/UserContext';
import kudiImage from './img/kudi.png';
import { FaMoon, FaSun, FaEye, FaEyeSlash } from 'react-icons/fa'; 
import confetti from 'canvas-confetti';

const calculatePasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[\W_]/.test(password)) strength += 1;
  return strength;
};

const launchConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { users, currentUser, setCurrentUser, setActiveStatus } = useContext(UserContext);

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password));
  }, [password]);

  useEffect(() => {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    const numberOfParticles = 100;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.2) this.size -= 0.1;
      }
      draw() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }

    function init() {
      particlesArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      requestAnimationFrame(animate);
    }

    init();
    animate();

    window.addEventListener('resize', function () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    });
  }, []);

  useEffect(() => {
    launchConfetti();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const user = users.find(u => u.name === username && u.password === password);
    if (user) {
      if (!user.isActive || !currentUser) {
        setCurrentUser(user);
        setActiveStatus(user.id, true);
        if (rememberMe) {
          localStorage.setItem('username', username);
        } else {
          localStorage.removeItem('username');
        }
        setTimeout(() => {
          navigate('/admin');
        }, 1000);
      } else {
        setError('Kullanıcı zaten başka bir oturumda açık.');
      }
    } else {
      setError('Geçersiz kullanıcı adı veya şifre');
    }
    setLoading(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const renderPasswordStrength = () => {
    const strengthLabels = ['Çok Zayıf', 'Zayıf', 'Orta', 'Güçlü', 'Çok Güçlü'];
    const strengthColors = ['#ff4c4c', '#ff6f6f', '#ffb84c', '#4caf50', '#2e7d32'];
    return (
      <div className="password-strength">
        <div
          className="password-strength-bar"
          style={{ width: `${(passwordStrength / 5) * 100}%`, backgroundColor: strengthColors[passwordStrength - 1] }}
        ></div>
        <span style={{ color: strengthColors[passwordStrength - 1] }}>
          {strengthLabels[passwordStrength - 1] || ''}
        </span>
      </div>
    );
  };

  return (
    <div className={`login-container ${darkMode ? 'dark-mode' : ''}`}>
      <canvas id="trail-canvas"></canvas>
      <canvas id="particle-canvas"></canvas>
      <div className="parallax-layer layer1" data-speed="5"></div>
      <div className="parallax-layer layer2" data-speed="3"></div>
      <div className="parallax-layer layer3" data-speed="1"></div>
      <div className="login-background">
        <div className="login-box">
          <img src={kudiImage} alt="Kudi Logo" className="login-logo" />
          <h2>Giriş</h2>
          <button className="dark-mode-toggle" onClick={toggleDarkMode}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="Kullanıcı adınızı girin"
              />
              <label>Kullanıcı Adı</label>
            </div>
            <div className="form-group">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Şifrenizi girin"
              />
              <label>Şifre</label>
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {renderPasswordStrength()}
            </div>
            <div className="form-group remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label>Beni Hatırla</label>
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Yükleniyor...' : 'Giriş Yap'}
            </button>
            <button type="button" className="signup-button" onClick={() => navigate('/signup')}>
              Üyelik İste
            </button>
            <button type="button" className="forgot-password-button" onClick={() => navigate('/forgot-password')}>
              Şifremi Unuttum
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
