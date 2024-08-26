
const mysql = require('mysql2');
// Configurar o banco de dados
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '4462', 
  database: 'orfe',
});

module.exports = pool;
