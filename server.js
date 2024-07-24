const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const readUsersFromFile = () => {
  const data = fs.readFileSync('users.json');
  return JSON.parse(data);
};

const writeUsersToFile = (users) => {
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
