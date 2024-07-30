const express = require('express');
const fs = require('fs').promises;
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const readUsersFromFile = async () => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'users.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users.json:', error);
    return [];
  }
};

const writeUsersToFile = async (users) => {
  try {
    await fs.writeFile(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2));
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
  const users = await readUsersFromFile();
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

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
