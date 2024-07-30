const express = require('express');
const fs = require('fs').promises;
const cors = require('cors');
const path = require('path');
const net = require('net');
const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = ['http://localhost:3000', 'http://localhost:54977', 'http://stildunyasi.site'];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// React build dosyalarını servis edin
app.use(express.static(path.join(__dirname, 'build')));

const readUsersFromFile = async () => {
  try {
    const data = await fs.readFile('users.json');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users.json:', error);
    return [];
  }
};

const writeUsersToFile = async (users) => {
  try {
    await fs.writeFile('users.json', JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing to users.json:', error);
  }
};

app.get('/users', async (req, res) => {
  const users = await readUsersFromFile();
  res.json(users);
});

app.post('/users', async (req, res) => {
  const users = await readUsersFromFile();
  const newUser = { ...req.body, id: users.length ? users[users.length - 1].id + 1 : 1 };
  users.push(newUser);
  await writeUsersToFile(users);
  res.json(newUser);
});

app.delete('/users/:id', async (req, res) => {
  let users = await readUsersFromFile();
  users = users.filter(user => user.id !== parseInt(req.params.id));
  await writeUsersToFile(users);
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
