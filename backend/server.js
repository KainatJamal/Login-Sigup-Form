const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg'); // PostgreSQL connection
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const serviceAccount = require('./serviceAccountKey.json'); 
const app = express();
app.use(cors());
app.use(bodyParser.json());
initializeApp({
  credential: serviceAccount,
});
const SECRET_KEY = 'your_secret_key';
const pool = new Pool({
  user: 'postgres',      
  host: 'localhost',
  database: 'user_authentication',
  password: 'kainat123', 
  port: 5432,
});
app.post('/api/auth/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertResult = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, email`,
      [firstName, lastName, email, hashedPassword]
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: insertResult.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login (email/password)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare the provided password with the stored hashed password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Sign Up with Google (Firebase)
app.post('/api/auth/signup/google', async (req, res) => {
  const { tokenId } = req.body; // The ID token sent from frontend after Google login

  try {
    // Verify the Firebase ID token
    const decodedUser = await getAuth().verifyIdToken(tokenId);
    const { uid, email, name } = decodedUser;

    // Check if the user already exists in PostgreSQL
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Extract first and last name from Firebase
    const [firstName, lastName] = name.split(' ');

    // Save the new user to PostgreSQL
    const insertResult = await pool.query(
      `INSERT INTO users (first_name, last_name, email) VALUES ($1, $2, $3) RETURNING id, first_name, last_name, email`,
      [firstName, lastName, email]
    );

    // Return user info without password since it's a Google sign-in
    res.status(201).json({
      message: 'User signed up with Google successfully',
      user: insertResult.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error signing up with Google' });
  }
});

// Login with Google (Firebase)
app.post('/api/auth/login/google', async (req, res) => {
  const { tokenId } = req.body; // The ID token sent from frontend after Google login

  try {
    // Verify the Firebase ID token
    const decodedUser = await getAuth().verifyIdToken(tokenId);
    const { uid, email, name } = decodedUser;

    // Check if the user exists in PostgreSQL
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging in with Google' });
  }
});

// Server Setup
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
