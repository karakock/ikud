const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Build dosyalarını servis et
app.use(express.static(path.join(__dirname, 'build')));

const readUsersFromFile = () => {
  try {
    const data = fs.readFileSync('users.json', 'utf8');
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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is in use, trying another port...`);
    app.listen(0, () => {
      const address = app.address();
      console.log(`Server running on http://localhost:${address.port}`);
    });
  } else {
    console.error(err);
  }
});
