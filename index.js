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

//MONGO DB API
const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.BD_USER_PASSWORD}@cluster0.4fdxwm9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//MONGO DB FUNCTION
async function mongoDbRun() {
    try {
        const collection = client.db("servicesCollection").collection("services");

        //READ_OPERATION
        app.get("/services", async (req, res) => {
            const query = {};
            const cursor = collection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
    } finally { }
} mongoDbRun().catch((err) => console.error(err));



//APP LISTENERS
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})