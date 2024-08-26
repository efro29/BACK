
const express = require('express');
const router = express.Router();
const userDAO = require('../dao/querys')
const app = express();
const bcrypt = require('bcryptjs');
const pool = require('../db'); 
const jwt = require('jsonwebtoken');




router.get('/users', (req, res) => {

  userDAO.getAllUsers((error, results) => {
    if (error) {
      console.error('Error fetching users:', error);  // Mensagem de erro
      return res.status(500).json({ error: 'Error fetching users' });
    }
    res.status(200).json(results);  // Enviar os usuários como resposta
  });
});




router.post('/addUser', (req, res) => {

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: 'Error hashing password' });


    pool.query(
      'INSERT INTO users (userId, userPass) VALUES (?, ?)',
      [username, hashedPassword],
      (error, results) => {
        if (error) {
          console.error('Error inserting user:', error);
          return res.status(500).json({ error: 'Error inserting user' });
        }
        res.status(201).json({ message: 'User added successfully', userId: results.insertId });
      }
    );
  });
});




router.post('/login', (req, res) => {
  const { username, password } = req.body;

  authenticateUser(username, password, (error, token) => {
    if (error) return res.status(500).json({ error: 'Internal server error' });
    if (token) {
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});



const authenticateUser = (username, password, callback) => {
  pool.query('SELECT * FROM users WHERE userId = ?', [username], (error, results) => {
    if (error) return callback(error);
    if (results.length > 0) {
      const user = results[0];

      bcrypt.compare(password, user.userPass, (err, isMatch) => {

        console.log(password + user.userPass)

        if (err) return callback(err);
        if (isMatch) {
          const token = jwt.sign({ id: user.id, username: user.userId }, 'secretkey', { expiresIn: '1h' });
          callback(null, token);
        } else {
          callback(null, null);
        }
      });
    } else {
      callback(null, null);
    }
  });
};



module.exports = router;
