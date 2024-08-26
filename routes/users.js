
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




//Inserir Novo Usuario
router.post('/addUser', (req, res) => {
  const { username, password, email, fullname } = req.body;
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





module.exports = router;
