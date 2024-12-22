const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const WebSocket = require('ws');

const app = express();
const PORT = 3000;

// Połączenie z bazą danych
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'authly',
});

db.connect((err) => {
  if (err) {
    console.error('Błąd połączenia z bazą danych:', err);
    return;
  }
  console.log('Połączono z bazą danych MySQL');
});

// Tworzenie serwera WebSocket
const wss = new WebSocket.Server({ port: 3001 });

wss.on('connection', (ws) => {
  console.log('Nowe połączenie WebSocket');

  ws.on('message', async (message) => {
    const data = JSON.parse(message);
    if (data.type === 'login') {
      const { username, password } = data.payload;

      const query = 'SELECT * FROM users WHERE username = ?';
      db.query(query, [username], async (err, results) => {
        if (err) {
          return ws.send(JSON.stringify({ type: 'error', message: 'Błąd serwera' }));
        }
        if (results.length === 0) {
          return ws.send(JSON.stringify({ type: 'error', message: 'Nieprawidłowa nazwa użytkownika lub hasło.' }));
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          const now = new Date();
          const currentTimestamp = now.toISOString().slice(0, 19).replace('T', ' ');
          const clientIp = ws._socket.remoteAddress;

          // Aktualizacja last_login, last_ip, i ip_list
          const updateQuery = `
            UPDATE users 
            SET last_login = ?, last_ip = ?, ip_list = IFNULL(CONCAT(ip_list, ?, ','), ?)
            WHERE id = ?
          `;
          db.query(updateQuery, [currentTimestamp, clientIp, clientIp, clientIp, user.id], (err) => {
            if (err) {
              return ws.send(JSON.stringify({ type: 'error', message: 'Błąd podczas aktualizacji danych użytkownika' }));
            }
            ws.send(JSON.stringify({ type: 'success', message: 'Login successful', user: { username } }));
          });
        } else {
          ws.send(JSON.stringify({ type: 'error', message: 'Nieprawidłowa nazwa użytkownika lub hasło.' }));
        }
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
