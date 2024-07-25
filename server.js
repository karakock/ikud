const express = require('express');
const fs = require('fs');
const https = require('https');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Sertifika dosyalarını yükleyin
const privateKey = fs.readFileSync('C:/ProgramData/win-acme/acme-v02.api.letsencrypt.org/Certificates/privatekey.pem', 'utf8');
const certificate = fs.readFileSync('C:/ProgramData/win-acme/acme-v02.api.letsencrypt.org/Certificates/certificate.pem', 'utf8');
const ca = fs.readFileSync('C:/ProgramData/win-acme/acme-v02.api.letsencrypt.org/Certificates/chain.pem', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
};

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

// HTTPS sunucusunu oluşturun
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
  console.log(`Secure server running on https://your_domain_or_ip:${PORT}`);
});
