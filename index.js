const express = require('express')
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dkwhsex.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const ServiceDB = client.db("ServiceDB").collection("service");

        // data saved 
        app.post('/allSrvices', async (req, res) => {
            const Servicedata = req.body
            const result = await ServiceDB.insertOne(Servicedata)
            res.send(result)
        })

        // get data for ui
        app.get('/allService', async (req, res) => {
            const result = await ServiceDB.find().limit(6).toArray()
            res.send(result)
        })

        // data collct by user email
        app.get('/services/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const result = await ServiceDB.find(query).toArray()
            res.send(result)
        })

        // delete job post
        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await ServiceDB.deleteOne(query)
            res.send(result)
        })

        // get one data by id
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await ServiceDB.findOne(query)
            res.send(result)
        })

        app.put('/update-job/:id', async (req, res) => {
            const id = req.params.id
            const jobdata = req.body
            const updated = {
                $set: jobdata,
            }
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const result = await database.updateOne(query, updated, options)
            res.send(result)
        })


        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})