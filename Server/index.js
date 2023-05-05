const express = require('express');
const app = express();
const port = 6868;
const morgan=require("morgan")
app.use(morgan("combined"))
const bodyParser=require("body-parser")
app.use(express.json({ limit: '210mb' }));
app.use(express.urlencoded({ limit: '210mb' }));
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
const productCollection = database.collection("Product");
const userCollection = database.collection("User");
const orderCollection = database.collection("Order");
const blogCollection = database.collection("Blog")
const myOrderCollection = database.collection("myOrder");
const myProductCollection = database.collection("myProduct");
const voucherCollection = database.collection("Voucher");
const myVoucherCollection = database.collection("myVoucher");
const myDataCollection = database.collection("myData");

app.post("/users", cors(), async(req, res) => {
    var crypto = require('crypto');
    salt = crypto.randomBytes(16).toString('hex');
    userCollection = database.collection("User");
    user=req.body;
    hash = crypto.pbkdf2Sync(user.Password, salt,1000, 64, `sha512`).toString(`hex`);
    user.Password=hash;
    user.salt=salt
    await userCollection.insertOne(user)
    res.send(req.body)
})
app.post("/login", cors(), async(req, res) => {
    UserName=req.body.UserName;
    Password=req.body.Password
    var crypto = require('crypto');
    userCollection = database.collection("User")
    user=await userCollection.findOne({UserName:UserName})
    if(user==null) 
        res.send({"username":UserName, "message":"Tài khoản không tồn tại!"})
    else {
        hash = crypto.pbkdf2Sync(Password, user.salt, 1000, 64, `sha512`).toString(`hex`)
        if(user.Password==hash)
        res.send(user)
        else {
            res.send({"username": UserName, "password":Password, "message": "Sai mật khẩu!"})
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
//API lấy ID của người dùng
app.get("/myList/users/:id",cors(),async (req,res)=>{
   var o_id = new ObjectId(req.params["id"]);
   const result = await myDataCollection.find({_id:o_id}).toArray();
   res.send(result[0])
})
//API xóa một User dựa vào id
app.delete("/myList/:id",cors(),async(req,res)=>{
  //find detail Fashion with id
  var o_id = new ObjectId(req.params["id"]);
  const result = await myDataCollection.find({_id:o_id}).toArray();
  //update json Fashion into database
      await myDataCollection.deleteOne(
          {_id:o_id}
      )
  //send Fahsion after remove
      res.send(result[0])
})
app.get("/promotion",cors(),async (req,res)=>{
  const result = await voucherCollection.find({}).toArray();
  res.send(result)
})
app.get("/promotion/:id",cors(),async (req,res)=>{
  var o_id = new ObjectId(req.params["id"]);
  const result = await voucherCollection.find({_id:o_id}).toArray();
  res.send(result[0])
  }
  )
app.post('/promotion', cors(), (req, res) => {
  try {
      voucherCollection.insertOne({
          Code: req.body.Code,
          Name: req.body.Name,
          Discount: req.body. Discount,
          Quantity: req.body.Quantity,
          Condition: req.body.Condition,
          CreatedAt: new Date().toISOString(),
          StartDate: req.body.StartDate,
          ExpireDate: req.body.ExpireDate
      })
      res.send(responseSuccess('Create', 'promotion'))
  } catch (e) {
      res.send(responseError())
  }
})
app.delete('/promotion/:id',cors(),async(req,res)=>{ 
  var o_id = new ObjectId(req.params["id"]);
  const result = await voucherCollection.find({_id:o_id}).toArray(); 
  await voucherCollection.deleteOne(
  {_id:o_id}
  )
  res.send(result[0])
  })
  app.get('/products-admin', cors(), async (req, res) => {
    let query = null
    let searchQuery = {}
    let data
    let perPage = Number(req.query.perPage) || 10
    let page = req.query.page || 1
    let totalItem = await productCollection.count()

    //để sort thì pass by param. ví dụ: /products?sortBy=&orderBy= là không truyền params thì nó sẽ ko sort
    //khi sort thì pass params như sau: /products?sortBy=name?orderBy=asc . . . còn lại thì tương tự
    const sortBy = req.query.sortBy
    const orderBy = req.query.orderBy

    //params để search, có thể vừa kết hợp với sort ( đem lại trải nghiệm tốt hơn nếu cố định được sort và search tự do )
    const search = req.query.search
    if (search) searchQuery = { Name: { "$regex": `${search}.*`, "$options": "i" } }

    if (sortBy == 'name' && orderBy == 'asc') query = { Name: 1 }
    else if (sortBy == 'name' && orderBy == 'desc') query = { Name: -1 }

    if (sortBy == 'category' && orderBy == 'asc') query = { Category: 1 }
    else if (sortBy == 'category' && orderBy == 'desc') query = { Category: -1 }

    if (query) data = await productCollection
        .find(searchQuery)
        .sort(query)
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .toArray()
    else data = await productCollection
        .find(searchQuery)
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .toArray()

    const finalData = {
        totalItem: totalItem,
        data: data
    }

    res.send(finalData)
})
app.get('/product-admin/:id', cors(), async (req, res) => {
  const id = new ObjectId(req.params['id'])
  res.send(await productCollection.findOne({ _id: id }))
})


app.post('/products-admin', cors(), async (req, res) => {
  try {
      productCollection.insertOne({
          Name: req.body.Name,
          Variant: req.body.Variant,
          Description: req.body.Description,
          Img: req.body.Img,
          Category: req.body.Category,
          CreatedAt: new Date().toISOString(),
          UpdatedAt: new Date().toISOString(),
      })
      res.send(responseSuccess('Create', 'product'))
  } catch (e) {
      res.send(responseError())
  }
})

app.put('/products-admin/:id', cors(), (req, res) => {
  const id = new ObjectId(req.params['id'])
  const filter = { _id: id }
  let currentDate = new Date().toLocaleString()

  productCollection.updateOne(filter,
      {
          $set: {
              Name: req.body.Name,
              Variant: req.body.Variant,
              Description: req.body.Description,
              Img: req.body.Img,
              Category: req.body.Category,
              UpdatedAt: new Date(currentDate).toISOString(),
          }
      }, function (err) {
          if (err) throw err
      })
  res.send(responseSuccess('Update', 'product'))
})

app.delete('/products-admin/:id', cors(), async (req, res) => {
  const id = new ObjectId(req.params['id'])
  const result = await productCollection.deleteOne({ _id: id })
  if (result.deletedCount === 1) {
      res.send(responseSuccess('Delete', 'product'))
  } else {
      res.send(responseError())
  }
})
//API get order lên 
app.get("/orders",cors(),async (req,res)=>{
  const result = await orderCollection.find({}).toArray();
  res.send(result)
  }
  )
  app.get("/order/:orderstatus", cors(), async (req, res) => {
    const orderstatus = req.params.orderstatus;
    const result = await orderCollection.find({ OrderStatus: orderstatus }).sort({ cDate: -1 }).toArray();
    res.send(result);
  });