const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.ihwvydu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)
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
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        const handiCraftsCollection = client.db('handiCraftsDB').collection('handiCrafts');
        const blogCollection = client.db('handiCraftsDB').collection('blogs');
        const userCollection = client.db('userDB').collection('user');

        app.get('/blogs', async (req, res) => {
            const cursor = blogCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await blogCollection.findOne(query);
            res.send(result);
        })
        
        app.get('/craftItem', async (req, res) => {
            const cursor = handiCraftsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/craftItem/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await handiCraftsCollection.findOne(query);
            res.send(result);

        });

        app.get('/myCraftItem/:email', async (req, res) => {
            console.log(req.params.email);

            const result = await handiCraftsCollection.find({ email: req.params.email }).toArray();

            res.send(result);
            console.log(result);
        })

        app.post('/craftItem', async (req, res) => {
            const newCraftItem = req.body;
            console.log(newCraftItem);
            const result = await handiCraftsCollection.insertOne(newCraftItem);
            res.send(result);

        });


        app.put('/craftItem/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedCraft = req.body;
            const craft = {
                $set: {

                    item: updatedCraft.item,
                    category: updatedCraft.category,
                    image: updatedCraft.image,
                    stock: updatedCraft.stock,
                    customize: updatedCraft.customize,
                    price: updatedCraft.price,
                    rating: updatedCraft.rating,
                    processing: updatedCraft.processing,
                    description: updatedCraft.description

                }
            };
            const result = await handiCraftsCollection.updateOne(filter, craft, options);
            res.send(result);
        })

        app.delete('/craftItem/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await handiCraftsCollection.deleteOne(query);
            res.send(result);
        })
        // user

        app.post('/user', async (req, res) => {
            const newUser = req.body;
            console.log(newUser);
            const result = await userCollection.insertOne(newUser);
            res.send(result);

        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('HandiCrafts server is running');
});

app.listen(port, () => {
    console.log(`HandiCrafts is running on port : ${port}`)
});