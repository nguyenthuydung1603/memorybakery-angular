const express = require('express');
const app = express();
const port = 10;
const morgan=require("morgan")
app.use(morgan("combined"))
const bodyParser=require("body-parser")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const cors=require("cors");
app.use(cors())
app.listen(port,()=>{
console.log(`My Server listening on port ${port}`)
})
app.get("/",(req,res)=>{
res.send("This Web server is processed for MongoDB")
})
const { MongoClient, ObjectId } = require('mongodb');
client = new MongoClient("mongodb://127.0.0.1:27017");
client.connect();
database = client.db("Memory_Bakery"); 
productCollection = database.collection("Product");
userCollection = database.collection("User");
orderCollection = database.collection("Order");



app.get
app.post("/users", cors(), async(req, res) => {
    var crypto = require('crypto');
    salt = crypto.randomBytes(16).toString('hex');
    userCollection = database.collection("User");
    user=req.body;
    hash = crypto.pbkdf2Sync(user.password, salt,1000, 64, `sha512`).toString(`hex`);
    user.password=hash;
    user.salt=salt
    await userCollection.insertOne(user)
    res.send(req.body)
})
app.post("/login", cors(), async(req, res) => {
    username=req.body.username;
    password=req.body.password
    var crypto = require('crypto');
    userCollection = database.collection("User")
    user=await userCollection.findOne({username:username})
    if(user==null) 
        res.send({"username":username, "message":"không tồn tại nha fen"})
    
    else {
        hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, `sha512`).toString(`hex`)
        if(user.password==hash)
        res.send(user)
        else {
            res.send({"username": username, "password":password, "message": "Sai mật khẩu rồi fen"})
        }
    }
})
app.get("/products",cors(),async (req,res)=>{
    const result = await productCollection.find({}).toArray();
    res.send(result)
    }
    )

app.post("/cart",cors(),(req,res)=>{
    product=req.body;
    if(req.session.carts=null)
    req.session.carts=[]
    req.session.carts.push(product)
    res.send(product)
}
)

app.get("/cart",cors(),(req,res)=>{
    res.send(req.session.carts)
}
)

app.get("cart/:id",cors(),(req,res)=>{
    if(req.session.carts=null){
        p=req.session.carts.find(x=>x.barcode==req.body.barcode)
        res.send(p)
    }
    else
        res.send(null)
}
)

app.delete("cart/:id",cors(),(req,res)=>{
    if(req.session.carts=null){
        id=req.params['id']
        req.session.carts=req.session.carts.filter(x=>x.barcode!=id)
    }
    res.send(req.session.carts)
}
)

app.put("cart/:id",cors(),(req,res)=>{
    if(req.session.carts=null){
        p=req.session.carts.find(x=>x.barcode==req.body.barcode)
        if(p!=null){
            p.quantity=req.body.quantity
        }
        req.send(req.session.carts)
    }
}
)
app.get("/products",cors(),async (req,res)=>{ 
    const result = await productCollection.find({}).toArray();
    res.send(result)
    }
)
app.get("/products/:id",cors(),async (req,res)=>{
    var o_id = new ObjectId(req.params["id"]);
    const result = await productCollection.find({_id:o_id}).toArray();
    res.send(result[0])
    }
    )
app.get("/products/:category", async (req, res) => {
    const category = req.params.category;
    const result = await productCollection.find({ Category: category }).toArray();
    res.send(result);
  });