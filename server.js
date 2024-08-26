// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5000;


const login = require('./routes/login');
const users =  require('./routes/users')


app.use(cors());
app.use(bodyParser.json());

app.use('/api', login); 
app.use('/users',users)


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
