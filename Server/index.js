const express = require('express');
const app = express();
const port = 6868;
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
const blogCollection = database.collection("Blog")
myOrderCollection = database.collection("myOrder");
productCollection = database.collection("Product");
myProductCollection = database.collection("myProduct");
voucherCollection = database.collection("Voucher");
myVoucherCollection = database.collection("myVoucher");
myDataCollection = database.collection("myData");

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
})
app.post("/cart",cors(),(req,res)=>{
    product=req.body;
    if(req.session.carts=null)
    req.session.carts=[]
    req.session.carts.push(product)
    res.send(product)
})
app.get("/cart",cors(),(req,res)=>{
    res.send(req.session.carts)
})
app.get("cart/:id",cors(),(req,res)=>{
  if(req.session.carts=null){
      p=req.session.carts.find(x=>x.barcode==req.body.barcode)
      res.send(p)
  }
  else
      res.send(null)
})
app.delete("cart/:id",cors(),(req,res)=>{
  if(req.session.carts=null){
      id=req.params['id']
      req.session.carts=req.session.carts.filter(x=>x.barcode!=id)
  }
  res.send(req.session.carts)
})
app.put("cart/:id",cors(),(req,res)=>{
  if(req.session.carts=null){
      p=req.session.carts.find(x=>x.barcode==req.body.barcode)
      if(p!=null){
          p.quantity=req.body.quantity
      }
      req.send(req.session.carts)
  }
})
app.get("/products",cors(),async (req,res)=>{ 
  const result = await productCollection.find({}).toArray();
  res.send(result)
})
app.get("/products/:id",cors(),async (req,res)=>{
  var o_id = new ObjectId(req.params["id"]);
  const result = await productCollection.find({_id:o_id}).toArray();
  res.send(result[0])
})
app.get("/products/category/:category", async (req, res) => {
  const category = req.params["category"];
  const result = await productCollection.find({ Category: category }).toArray();
  res.send(result);
});
app.get("/products/price/:minprice/:maxprice", async (req, res) => {
  const minPrice = parseFloat(req.params.minprice);
  const maxPrice = parseFloat(req.params.maxprice);
  const products = await productCollection.find({
      "Variant.0.PromotionPrice" : { $gte: minPrice, $lte: maxPrice },
  }).toArray();   
  res.send(products);
  });
// blog
app.get('/blogs-sorted', cors(), async (req, res) => {
    let perPage = 5
    let page = req.query.page || 1
    let totalItem = await blogCollection.count()

    let blogs = await blogCollection
        .find({}, { _id: 0 })
        .sort({ 'CreateDate': -1 })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .toArray()

    const data = {
        totalItem: totalItem,
        data: blogs
    }
    res.send(data)
})

app.get('/blogs-outstanding', cors(), async (req, res) => {
    res.send(await blogCollection.find({ Outstanding: { $ne: false } }).toArray())
})

app.get('/blog/:id', cors(), async (req, res) => {
    const id = new ObjectId(req.params['id'])
    res.send(await blogCollection.findOne({ _id: id }))
})

app.post('/blogs', cors(), (req, res) => {
    try {
        blogCollection.insertOne({
            BlogID: null,
            Title: req.body.title,
            CreateDate: new Date().toISOString(),
            Writer: req.body.writer,
            Content: req.body.content,
            Image: [],
            Outstanding: req.body.outstanding
        })
        res.send(responseSuccess('Create', 'blog'))
    } catch (e) {
        res.send(responseError())
    }
})

app.put('/blogs/:id', cors(), (req, res) => {
    const id = new ObjectId(req.params['id'])
    const filter = { _id: id }

    blogCollection.updateOne(filter,
        {
            $set: {
                BlogID: null,
                Title: req.body.title,
                Writer: req.body.writer,
                Content: req.body.content,
                Image: [],
                Outstanding: req.body.outstanding
            }
        }, function (err) {
            if (err) throw err
        })
    res.send(responseSuccess('Update', 'blog'))
})

app.delete('/blogs/:id', cors(), async (req, res) => {
    const id = new ObjectId(req.params['id'])
    const result = await blogCollection.deleteOne({ _id: id })
    if (result.deletedCount === 1) {
        res.send(responseSuccess('Delete', 'blog'))
    } else {
        res.send(responseError())
    }
})

function responseSuccess(action = 'your action', type = '') {
    return {
        "message": `${action} ${type} successful`
    }
}

function responseError(action, type) {
    return {
        "message": `Something went wrong! Please check again`
    }
}
//Ghép Các collection myOrder, myProduct, myVoucher, myReview
myDataCollection.deleteMany({})
  .then(() => {
    userCollection.aggregate([
      {
        $addFields: {
          _id: { $toString: "$_id" }
        }
      },
      {
        $lookup: {
          from: "myProduct",
          localField: "_id",
          foreignField: "UserID",
          as: "myProduct"
        }
      },
      {
        $unwind: {
          path: "$myProduct",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "myVoucher",
          localField: "_id",
          foreignField: "UserID",
          as: "myVoucher"
        }
      },
      {
        $unwind: {
          path: "$myVoucher",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "myOrder",
          localField: "_id",
          foreignField: "UserID",
          as: "myOrder"
        }
      },
      {
        $unwind: {
          path: "$myOrder",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          ProductID: {
            $map: {
              input: "$myProduct.ProductID",
              as: "pid",
              in: {
                $toObjectId: "$$pid"
              }
            }
          }
        }
      },  
      {
        $lookup: {
          from: "Product",
          localField: "ProductID",
          foreignField: "_id",
          as: "Product"
        }
      },
      {
        $addFields: {
          VoucherID: {
            $map: {
              input: "$myVoucher.VoucherID",
              as: "pid",
              in: {
                $toObjectId: "$$pid"
              }
            }
          }
        }
      },  
      {
        $lookup: {
          from: "Voucher",
          localField: "VoucherID",
          foreignField: "_id",
          as: "Voucher"
        }
      },
      {
        $addFields: {
          OrderID: {
            $map: {
              input: "$myOrder.OrderID",
              as: "pid",
              in: {
                $toObjectId: "$$pid"
              }
            }
          }
        }
      },  
      {
        $lookup: {
          from: "Order",
          localField: "OrderID",
          foreignField: "_id",
          as: "Order"
        }
      },
      {
        $group: {
          _id: "$_id",
          User: { $first: "$$ROOT" },
          Product: { $addToSet: "$Product" },
          Voucher: { $addToSet: "$Voucher" },
          Order: { $addToSet: "$Order" },
        }
      },
      {
        $project: {
          _id: 0,
          User: {
            _id:1,
            UserID: 1,
            FullName: 1,
            Gender: 1,
            DateOfBirth: 1,
            Phone: 1,
            Image:1,
            Address: 1,
            UserName: 1,
            Password: 1,
            CreateDate: 1,
            UserType: 1,
          },
          Product: {
            $filter: {
              input: { $arrayElemAt: ["$Product", 0] },
              as: "product",
              cond: { $ne: ["$$product", null] }
            }
          },
          Voucher: {
            $filter: {
              input: { $arrayElemAt: ["$Voucher", 0] },
              as: "voucher",
              cond: { $ne: ["$$voucher", null] }
            }
          },
          Order: {
            $filter: {
              input: { $arrayElemAt: ["$Order", 0] },
              as: "order",
              cond: { $ne: ["$$order", null] }
            }
          }
        }
      },
    ]).toArray()
    .then(results => {
      myDataCollection.insertMany(results)
          .then(result => {
              console.log(`Inserted ${result.insertedCount} documents`);
          })
          .catch(error => {
              console.error(`Error inserting documents: ${error}`);
          });
    })
    .catch(error => {
      console.error(`Error executing aggregation: ${error}`);
    });
  })
  .catch(error => {
    console.error(`Error deleting documents: ${error}`);
  });

//API truy xuất toàn bộ User là Khách hàng
app.get("/myList",cors(),async (req,res)=>{
  const result = await myDataCollection.find({"User.UserType.TypeName": "Customer"}).toArray();
  res.send(result)
})
//API để truy xuất thông tin của một user có username nhất định
app.get("/myList/:username",cors(),async (req,res)=>{
    const username = req.params.username;
    const result = await myDataCollection.findOne({"User.UserName":username, "User.UserType.TypeName": "Customer"});
    if(result){
      res.send(result);
    } else {
      res.status(404).send("User not found");
    }
})
app.get("/order-status", async (req, res) => {
  try {
    const result = await myDataCollection.distinct("Order.OrderStatus");
    res.send(result)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});