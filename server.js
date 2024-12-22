const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const WebSocket = require('ws');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config({ path: './secret.env' });


const app = express();

// Pobieranie portu z pliku `.env`
let PORT = parseInt(process.env.PORT, 10);
if (isNaN(PORT) || PORT <= 0 || PORT >= 65536) {
  console.error('Invalid PORT value in .env file. Using default port 3000.');
  PORT = 3000;
}

app.use(cors());
app.use(helmet());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

const wss = new WebSocket.Server({ port: PORT + 1 });

wss.on('connection', (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  console.log(`New connection from IP: ${clientIp}`);

  ws.on('message', async (message) => {
    const data = JSON.parse(message);

    if (data.type === 'register') {
      const { username, password, email } = data.payload;

      if (!username || !password || !email) {
        return ws.send(JSON.stringify({ type: 'error', message: 'All fields are required.' }));
      }

      const ipCheckQuery = 'SELECT COUNT(*) AS count FROM users WHERE last_ip = ?';
      db.query(ipCheckQuery, [clientIp], async (err, results) => {
        if (err) {
          return ws.send(JSON.stringify({ type: 'error', message: 'Server error' }));
        }

        const ipCount = results[0].count;
        if (ipCount > 0) {
          return ws.send(JSON.stringify({ type: 'error', message: 'Only one account is allowed.' }));
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const randomSecret = crypto.randomBytes(15).toString('hex');
        const now = new Date();
        const currentTimestamp = now.toISOString().slice(0, 19).replace('T', ' ');

        const insertQuery = `
          INSERT INTO users (username, password, email, created_at, last_ip, ip_list, last_login, secret, plan, admin, banned)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'free', 0, 0)
        `;

        db.query(
          insertQuery,
          [username, hashedPassword, email, currentTimestamp, clientIp, clientIp, currentTimestamp, randomSecret],
          (err) => {
            if (err) {
              return ws.send(JSON.stringify({ type: 'error', message: 'Server error during account creation' }));
            }
            ws.send(JSON.stringify({ type: 'success', message: 'Account successfully created.' }));
          }
        );
      });
    }

    if (data.type === 'login') {
      const { username, password } = data.payload;

      const query = 'SELECT * FROM users WHERE username = ?';
      db.query(query, [username], async (err, results) => {
        if (err) {
          return ws.send(JSON.stringify({ type: 'error', message: 'Server error' }));
        }
        if (results.length === 0) {
          return ws.send(JSON.stringify({ type: 'error', message: 'Invalid username or password.' }));
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);

        if (match) {
          const now = new Date();
          const currentTimestamp = now.toISOString().slice(0, 19).replace('T', ' ');
          const updateQuery = `
            UPDATE users
            SET last_login = ?, last_ip = ?, ip_list = IFNULL(CONCAT(ip_list, ?, ','), ?)
            WHERE id = ?
          `;
          db.query(updateQuery, [currentTimestamp, clientIp, clientIp, clientIp, user.id], (err) => {
            if (err) {
              return ws.send(JSON.stringify({ type: 'error', message: 'Error updating user data' }));
            }
            ws.send(JSON.stringify({ type: 'success', message: 'Login successful' }));
          });
        } else {
          ws.send(JSON.stringify({ type: 'error', message: 'Invalid username or password.' }));
        }
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
