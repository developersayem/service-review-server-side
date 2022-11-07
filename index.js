const express = require("express");
const cors = require("cors");
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const { query } = require("express");
const app = express();
const port = process.env.PORT || 5000;


// MIDDLEWARES
app.use(cors());
app.use(express.json());


// APP HOME
app.get('/', (req, res) => {
    res.send('Hello World!')
})


//APP LISTENERS
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    console.log(uri)
})