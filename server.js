const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const net = require('net');
const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: 'http://stildunyasi.site', // Canlı domaininiz
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// React build dosyalarını servis edin
app.use(express.static(path.join(__dirname, 'build')));

const readUsersFromFile = () => {
  try {
    const data = fs.readFileSync('users.json');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users.json:', error);
    return [];
  }
};

const writeUsersToFile = (users) => {
  try {
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing to users.json:', error);
  }
};

app.get('/users', (req, res) => {
  const users = readUsersFromFile();
  res.json(users);
});

app.post('/users', (req, res) => {
  const users = readUsersFromFile();
  const newUser = { ...req.body, id: users.length ? users[users.length - 1].id + 1 : 1 };
  users.push(newUser);
  writeUsersToFile(users);
  res.json(newUser);
});

app.delete('/users/:id', (req, res) => {
  let users = readUsersFromFile();
  users = users.filter(user => user.id !== parseInt(req.params.id));
  writeUsersToFile(users);
  res.json({ message: 'User deleted' });
});

// Tüm diğer istekler için React'in index.html dosyasını gönderin
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const checkPortAvailability = (port, callback) => {
  const tester = net.createServer()
    .once('error', err => (err.code === 'EADDRINUSE' ? callback(false) : callback(err)))
    .once('listening', () => tester.once('close', () => callback(true)).close())
    .listen(port);
};

checkPortAvailability(PORT, (isAvailable) => {
  if (!isAvailable) {
    console.log(`Port ${PORT} is in use. Trying another port...`);
    const server = app.listen(0, () => {
      const address = server.address();
      console.log(`Server running on http://localhost:${address.port}`);
    });
  } else {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
});
