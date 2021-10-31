const express = require('express');
const app = express();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');


require('dotenv').config();


//middleware
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extended: true
// }));



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wshhp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('sonderDB');
        const packagesCollection = database.collection('package');
        const ordersCollection = database.collection('orders')

        app.get('/packages', async (req, res) => {
            const cursor = packagesCollection.find({});
            const packages = await cursor.toArray();
            res.json(packages);

        })
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.json(orders)
        });

        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.findOne(query);
            res.json(result);
        })

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
        })

        app.post('/packages', async (req, res) => {
            const package = req.body;
            const result = await -packagesCollection.insertOne(package);
            res.json(result);
        })

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
};
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running my CRUD Server');
});


app.listen(port, () => {
    console.log('Running Server on port', port);
})