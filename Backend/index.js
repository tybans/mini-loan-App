const express = require('express');
require('dotenv').config()

const app = express();

PORT = process.env.PORT;

const dbConnect = require('./dbConnection')
dbConnect();

app.use(express.json());

app.get('/', (req, res) => {
  res.send("Hello from Server...")
})

app.listen(PORT, () => {
  console.log(`Server Started at http://localhost: ${PORT}`);
})