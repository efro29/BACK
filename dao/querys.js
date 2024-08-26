// /dao/userDAO.js
const pool = require('../db');

// Função para buscar todos os usuários
const getAllUsers = (callback) => {
  const query = 'SELECT * FROM users';

  pool.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching users:', error);  // Adiciona uma mensagem de erro
      return callback(error, null);
    }
    console.log('Users fetched:', results);  // Depuração para ver se os usuários estão sendo retornados
    callback(null, results);
  });
};

module.exports = {
  getAllUsers
};
