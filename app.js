const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ObjectID } = require('mongodb');
const port = process.env.PORT || 8080;
require('dotenv').config();

app.use(cors());
app.use(express.json());

// Home Route
app.get('/', (req, res) => {
    res.status(200).json({result: 'Backend Server Running...'})
})

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.hgubw.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const Users = client.db("organicDB").collection("users");
    console.log(err);

    app.post('/AddUsers', (req, res) => {
        const userReqName = req.body.name;
        const userReq = req.body;
        Users.find({ name: { $regex : new RegExp(userReqName, "i")} })
            .toArray((err, users) => {
                if (users.length > 0) {
                    res.json({ error: 'Username Already Exist' })
                } else {
                    Users.insertOne(userReq)
                        .then(result => {
                            res.send(result.insertedCount > 0)
                        })
                }
            })
    })
});


app.listen(port, () => {
    console.log(`App Listening at http://localhost:${port}`)
});
