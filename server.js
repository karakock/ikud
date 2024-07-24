const express = require('express');
const fs = require('fs');
const cors = require('cors');
const https = require('https');
const WebSocket = require('ws');
const app = express();
const PORT = 5000;
const WS_PORT = 443;

// SSL sertifika dosyalarının yolları
const serverOptions = {
  cert: fs.readFileSync('C:\\ProgramData\\win-acme\\acme-v02.api.letsencrypt.org\\<cert-path>\\cert.pem'),
  key: fs.readFileSync('C:\\ProgramData\\win-acme\\acme-v02.api.letsencrypt.org\\<cert-path>\\key.pem')
};

// HTTPS sunucusu oluşturma
const server = https.createServer(serverOptions, app);

// WebSocket sunucusu oluşturma ve proxy olarak yapılandırma
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  const targetWs = new WebSocket('ws://152.89.36.148:24876');

  ws.on('message', (message) => {
    targetWs.send(message);
  });

  targetWs.on('message', (message) => {
    ws.send(message);
  });

  ws.on('close', () => {
    targetWs.close();
  });

  targetWs.on('close', () => {
    ws.close();
  });
});

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
  console.log(`REST API server running on http://localhost:${PORT}`);
});

server.listen(WS_PORT, () => {
  console.log(`WebSocket proxy server running on https://localhost:${WS_PORT}`);
});
