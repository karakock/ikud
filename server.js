const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5001;

// CORS ayarları
const corsOptions = {
  origin: ['http://stildunyasi.site', 'http://localhost:3000'], // Güvenli domainleri belirleyin
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// JSON dosyasını otomatik olarak oku ve belleğe yükle
let users = [];
const loadUsers = () => {
  try {
    const data = fs.readFileSync('users.json', 'utf8');
    users = JSON.parse(data);
    console.log('Users loaded from JSON file:', users);
  } catch (error) {
    console.error('Error reading users.json:', error);
  }
};

// Sunucu başlatıldığında kullanıcıları yükle
loadUsers();

// Kullanıcıları listeleme API'si
app.get('/users', (req, res) => {
  res.json(users);
});

// Yeni kullanıcı ekleme API'si
app.post('/users', (req, res) => {
  const newUser = { ...req.body, id: users.length ? users[users.length - 1].id + 1 : 1 };
  users.push(newUser);
  fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
    if (err) {
      console.error('Error writing to users.json:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(newUser);
  });
});

// Kullanıcı silme API'si
app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  const initialLength = users.length;
  users = users.filter(user => user.id !== userId);
  if (users.length === initialLength) {
    return res.status(404).json({ error: 'User not found' });
  }
  fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
    if (err) {
      console.error('Error writing to users.json:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({ message: 'User deleted' });
  });
});

// Statik dosyaları servis et
app.use(express.static(path.join(__dirname, 'build')));

// Tüm yolları yakala ve index.html döndür
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Sunucuyu başlat
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
