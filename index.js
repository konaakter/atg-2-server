const express = require('express')
const app = express()
require('dotenv').config()


const cors = require('cors')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const port = process.env.PORT || 5000

app.use(cors())


app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World!')
})





const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://atgtasktow:wTnjftEGPBnhKQbT@cluster0.ah3a7qz.mongodb.net/?retryWrites=true&w=majority";

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
        //await client.connect();
        // Send a ping to confirm a successful connection

        const registercollectoin = client.db("registerdb").collection("register");
        const postcollection = client.db("registerdb").collection("post");


        app.post('/register', async (req, res) => {

            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const newUser = {
                 email: req.body.email,
                name: req.body.name,
               
                password: hashedPassword,
            };
            const result = await registercollectoin.insertOne(newUser);
            res.send(result);
        })

        app.post('/login', async (req, res) => {
            
            const iteam = req.body
             
            const user = await registercollectoin.findOne({ name: req.body.name });
            if (user) {
                const isValidPassword = await bcrypt.compare(req.body.password, user.password);

                if (isValidPassword) {
                    // generate token
                    const token = jwt.sign({
                        name: user.name,
                        userId: user._id,
                    }, process.env.JWT_SECRET, {
                        expiresIn: '1h'
                    });

                    res.status(200).json({
                        "access_token": token,
                        "message": "Login successful!",
                        "iteam" : iteam
                    });
                    
                } else {
                    res.status(401).json({
                        "error": "Authetication !"
                    });
                }
            } else {
                res.status(401).json({
                    "error": "Authetication failed!"
                });
            }

        })

        app.post('/datapost', async (req, res) => {
            const addpost = req.body;
            console.log(addpost );
            const postresult = await postcollection.insertOne(addpost );
            res.send( postresult);
          });

          app.get('/postget', async (req, res) => {
            console.log(req.query.users)
      
            let query = {};
            if (req.query?.users) {
              query = { users: req.query.users }
            }
            
            const getresult = await postcollection.find(query).toArray();
            res.send(getresult)
          });

          app.delete('/sletedpost/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await postcollection.deleteOne(query);
            res.send(result);
          })

          app.patch('/updatepost/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id) };
            const upadate = req.body
            const options = { upsert: true };
            const updateDoc = {
              $set: {
                details:upadate.details,
                header: upadate.header
              },
            };
            const updateresult = await postcollection.updateOne(query, updateDoc, options);
            res.send(updateresult)
          } )
        


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);







app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

/*

atgtasktow
wTnjftEGPBnhKQbT
*/


/*
router.post("/login", async(req, res) => {
    try {
        const user = await User.find({ username: req.body.username });
        if(user && user.length > 0) {
            const isValidPassword = await bcrypt.compare(req.body.password, user[0].password);

            if(isValidPassword) {
                // generate token
                const token = jwt.sign({
                    username: user[0].username,
                    userId: user[0]._id,
                }, process.env.JWT_SECRET, {
                    expiresIn: '1h'
                });

                res.status(200).json({
                    "access_token": token,
                    "message": "Login successful!"
                });
            } else {
                res.status(401).json({
                    "error": "Authetication failed!"
                });
            }
        } else {
            res.status(401).json({
                "error": "Authetication failed!"
            });
        }
    } catch {
        res.status(401).json({
            "error": "Authetication failed!"
        });
    }
});
*/





/*
 const iteam = req.body
        console.log(iteam)
        const query = { email: iteam.email, password: iteam.password }
        const extaingemail = await registercollectoin.findOne(query);
        if (extaingemail) {
          return res.send({ message: 'coorrect password' });
        }
        else{
            res.send({ message: 'incorrectcoorrect password' });
        }*/
















/* const iteam = req.body
    console.log(iteam)
    const query = { email: iteam.email }
    const extaingemail = await registercollectoin.findOne(query);
    if (extaingemail) {
        const isValidPassword = await bcrypt.compare(req.body.password, extaingemail[0].password);
        if (isValidPassword) {
            // generate token
            const token = jwt.sign({
                email: extaingemail[0].email,
                userId: user[0]._id,
            }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });

            res.status(200).json({
                "access_token": token,
                "message": "Login successful!"
            });
        } else {
            res.status(401).json({
                "error": "Authetication failed!"
            });
        }
    }
    else {
        res.status(401).json({
            "error": "Authetication failed!"
        });
    }
*/