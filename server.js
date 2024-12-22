const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config({ path: './secret.env' });

const app = express();
const PORT = parseInt(process.env.PORT, 10);

if (isNaN(PORT) || PORT <= 0 || PORT >= 65536) {
  process.exit(1);
}

app.use(cors());
app.use(helmet());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) process.exit(1);
  console.log('Connected to MySQL database');
});

app.post('/licenses', (req, res) => {
  const { licenses } = req.body;
  if (!licenses || licenses.length === 0) {
    return res.status(400).json({ error: 'No licenses provided' });
  }

  const values = licenses.map((license) => [
    license.user_secret,
    license.license_key,
    license.duration,
    license.type,
    0,
    null,
    license.note || null,
    license.generated_by || 'admin',
    null,
    'unused',
    new Date().toISOString().slice(0, 19).replace('T', ' '),
  ]);

  const query = `
    INSERT INTO licenses 
    (user_secret, license_key, duration, type, banned, ban_reason, note, generated_by, used_by, status, creation_date)
    VALUES ?
  `;

  db.query(query, [values], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to create licenses', details: err.message });
    }

    res.json({ message: 'Licenses created successfully', affectedRows: results.affectedRows });
  });
});

app.get('/licenses', (req, res) => {
  const { user_secret } = req.query;

  if (!user_secret) {
    return res.status(400).json({ error: 'Missing user_secret parameter' });
  }

  const query = 'SELECT * FROM licenses WHERE user_secret = ?';

  db.query(query, [user_secret], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch licenses' });
    }

    res.json(results);
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    if (results.length === 0) {
      return res.status(401).json({ auth: false, message: 'Invalid username or password' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      res.json({
        auth: true,
        message: 'Login successful',
        username: user.username,
        user_secret: user.secret,
      });
    } else {
      res.status(401).json({ auth: false, message: 'Invalid username or password' });
    }
  });
});

app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const checkQuery = 'SELECT * FROM users WHERE username = ?';
  db.query(checkQuery, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    if (results.length > 0) {
      return res.status(400).json({ error: 'Username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const randomSecret = crypto.randomBytes(15).toString('hex');

    const insertQuery = `
      INSERT INTO users (username, password, email, secret)
      VALUES (?, ?, ?, ?)
    `;
    db.query(insertQuery, [username, hashedPassword, email, randomSecret], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Server error during registration' });
      }
      res.json({ message: 'Registration successful' });
    });
  });
});

app.get('/user/:username', (req, res) => {
  const { username } = req.params;
  const query = 'SELECT plan, license_date, avatar, secret FROM users WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).json({ error: 'Failed to fetch user data' });
    }
    res.json(results[0]);
  });
});

const monitorLicenses = () => {
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const query = `
    UPDATE licenses
    SET status = 'expired'
    WHERE status = 'active' AND DATE_ADD(creation_date, INTERVAL duration DAY) < ?
  `;

  db.query(query, [now], (err, results) => {
    if (err) {
      console.error('Error updating expired licenses:', err);
    }
  });
};

setInterval(monitorLicenses, 60 * 1000);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
