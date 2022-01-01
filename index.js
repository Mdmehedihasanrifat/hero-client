const express = require("express");
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 5000;

//middleware
app.use(cors());
app.use(express.json())

const uri = "mongodb+srv://dbuser:IAJtMl7RqgGjSck6@cluster0.aaumw.mongodb.net/Curd?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log("server connected");
        const database = client.db('Crud');
        const usersCollection = database.collection('Curd');

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            res.json(user);

        })
        app.get('/savedUsers/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
           
        })

        //send users to database
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await usersCollection.insertOne(user);
            res.json(result);
        })

        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.json(users);
        })


    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Task Server Is Running")
})

app.listen(port, () => {
    console.log("Task Server Is Running at Port", port);
})