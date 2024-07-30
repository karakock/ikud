const express = require('express');
const fs = require('fs').promises;
const cors = require('cors');
const path = require('path');
const net = require('net');
const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: '*',  // Tüm origin'lere izin veriyoruz
  optionsSuccessStatus: 200,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
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

app.get('/api/users', async (req, res) => {
  const users = await readUsersFromFile();
  res.json(users);
});

app.get('/api/users/:id', async (req, res) => {
  const users = await readUsersFromFile();
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.post('/api/users', async (req, res) => {
  const users = await readUsersFromFile();
  const newUser = { ...req.body, id: users.length ? users[users.length - 1].id + 1 : 1 };
  users.push(newUser);
  await writeUsersToFile(users);
  res.json(newUser);
});

app.patch('/api/users/:id', async (req, res) => {
  let users = await readUsersFromFile();
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...req.body };
    await writeUsersToFile(users);
    res.json(users[userIndex]);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  let users = await readUsersFromFile();
  users = users.filter(user => user.id !== parseInt(req.params.id));
  await writeUsersToFile(users);
  res.json({ message: 'User deleted' });
});

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
