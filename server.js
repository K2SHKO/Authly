const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

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

// Endpoint do logowania
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Błąd serwera' });
    }
    if (results.length === 0) {
      return res.status(401).json({ auth: false, message: 'Nieprawidłowa nazwa użytkownika lub hasło.' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.json({ auth: true, message: 'Login successful' });
    } else {
      res.status(401).json({ auth: false, message: 'Nieprawidłowa nazwa użytkownika lub hasło.' });
    }
  });
});

// Endpoint do rejestracji
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  // Prosta walidacja (usuń, jeśli nie chcesz)
  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Wszystkie pola są wymagane.' });
  }

  const checkQuery = 'SELECT * FROM users WHERE username = ?';
  db.query(checkQuery, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Błąd serwera' });
    }
    if (results.length > 0) {
      return res.status(400).json({ error: 'Użytkownik o tej nazwie już istnieje.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hashowanie hasła
    const insertQuery = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
    db.query(insertQuery, [username, hashedPassword, email], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Błąd serwera' });
      }
      res.json({ message: 'Rejestracja zakończona sukcesem.' });
    });
  });
});

// Uruchom serwer
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
