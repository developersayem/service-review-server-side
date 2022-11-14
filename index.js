const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require("express");
const app = express();
const port = process.env.PORT || 5000;
const jwt = require('jsonwebtoken');

require('dotenv').config()


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
        const servicecollection = client.db("servicesCollection").collection("services");
        const reviewsCollection = client.db("servicesCollection").collection("reviews");

        //jwt----------------------------------------
        // REVIEWS READ_BY_EMAIL_OPERATION 
        app.get("/myreviews", verifyJwt, async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    "email": req.query.email
                }
            }
            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });


        app.post("/jwt", (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.send({ token })
        })
        function verifyJwt(req, res, next) {

            const authHeader = req.headers.authorization;
            console.log(authHeader)
            if (!authHeader) {
                res.status(401).send({ message: "unauthorized" })
            }
            const token = authHeader;
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
                if (err) {
                    res.status(403).send({ message: "unauthorized" })
                }
                req.decoded = decoded;
                next();
            })
        }

        //REVIEWS  CREATE ONE OPARATION(C)
        app.post("/reviews", async (req, res) => {
            const data = req.body;
            console.log(data);
            const reviews = await reviewsCollection.insertOne(data);
            res.send(reviews);
        });
        // REVIEWS READ_ALL_OPERATION
        app.get("/reviews", async (req, res) => {
            const query = {};
            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        // REVIEW_DELETE_OPARATION(D)
        app.delete("/myreviews/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewsCollection.deleteOne(query);
            res.send(result);
        });
        //RVIEW_ONLY ON DATA
        app.get("/review/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const review = await reviewsCollection.findOne(query);
            res.send(review);
        });
        //UPDATE OPARATION(U)
        app.put("/review/edit/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const review = req.body;
            const option = { upinsert: true };
            const updatedUser = {
                $set: {
                    description: review.description,
                    ratings: review.ratings,
                },
            };
            const result = await reviewsCollection.updateOne(
                filter,
                updatedUser,
                option
            );
            res.send(result);
        });




        //SERVICES CREATE ONE  OPARATION(C)
        app.post("/services", async (req, res) => {
            const data = req.body;
            console.log(data);
            const service = await servicecollection.insertOne(data);
            res.send(service);
        });
        // SERVICE READ_ALL_OPERATION 
        app.get("/services", async (req, res) => {
            const query = {};
            const cursor = servicecollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        // SERVICES READ_limit_OPERATION
        app.get("/homeservices", async (req, res) => {
            const query = {};
            const cursor = servicecollection.find(query).limit(3);
            const services = await cursor.toArray();
            res.send(services);
        });
        //SERVICES READ_ONE_OPERATION
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicecollection.findOne(query);
            res.send(service);
        });
    } finally { }
} mongoDbRun().catch((err) => console.error(err));



//APP LISTENERS
app.listen(port)