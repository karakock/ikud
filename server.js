const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Statik dosyaları sunmak için build klasörünü kullan
app.use(express.static(path.join(__dirname, 'build')));

// users.json dosyası için doğru yol
const usersFilePath = path.join(__dirname, 'public', 'users.json');

// Kullanıcıları JSON dosyasından okuma
const readUsersFromFile = () => {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('users.json dosyası okunurken hata oluştu:', error);
    return [];
  }
};

// Kullanıcıları JSON dosyasına yazma
const writeUsersToFile = (users) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
  } catch (error) {
    console.error('users.json dosyasına yazılırken hata oluştu:', error);
  }
};

// Kullanıcıları getirme
app.get('/users', (req, res) => {
  const users = readUsersFromFile();
  res.json(users);
});

// Yeni kullanıcı ekleme
app.post('/users', (req, res) => {
  const users = readUsersFromFile();
  const newUser = { ...req.body, id: users.length ? users[users.length - 1].id + 1 : 1 };

  users.push(newUser);
  writeUsersToFile(users);

  res.status(201).json(newUser);
});

// Kullanıcı silme
app.delete('/users/:id', (req, res) => {
  let users = readUsersFromFile();
  const userId = parseInt(req.params.id);

  if (!users.some(user => user.id === userId)) {
    return res.status(404).json({ message: 'User not found' });
  }

  users = users.filter(user => user.id !== userId);
  writeUsersToFile(users);

  res.json({ message: 'User deleted successfully' });
});

// Diğer tüm istekleri index.html dosyasına yönlendir
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Sunucuyu başlatma
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
