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
const voucherCollection = database.collection("Voucher");

app.post("/users", cors(), async(req, res) => {
  var crypto = require('crypto');
  salt = crypto.randomBytes(16).toString('hex');
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

// CÁC API LIÊN QUAN ĐẾN PRODUCT
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
app.get("/products/rate/:rate", async (req, res) => {
const rate = parseFloat(req.params.rate);
const result = await productCollection.find({ Rating: rate }).toArray();
res.send(result);
});
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

//CÁC API LIÊN QUAN ĐẾN CART
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

// CÁC API LIÊN QUAN ĐẾN BLOG
app.get("/getblog",cors(),async (req,res)=>{ 
const result = await blogCollection.find({}).toArray();
res.send(result)
})

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
}}
// CÁC API LIÊN QUAN ĐẾN PROMOTION
app.get("/promotion",cors(),async (req,res)=>{
const result = await voucherCollection.find({}).toArray();
res.send(result)
})
app.get("/promotion/:id",cors(),async (req,res)=>{
var o_id = new ObjectId(req.params["id"]);
const result = await voucherCollection.find({_id:o_id}).toArray();
res.send(result[0])
})
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

// CÁC API LIÊN QUAN ĐẾN ORDER
//API get order lên 
app.get("/orders",cors(),async (req,res)=>{
const result = await orderCollection.find({}).toArray();
res.send(result)
})
app.get("/order/:orderstatus", cors(), async (req, res) => {
const orderstatus = req.params.orderstatus;
const result = await orderCollection.find({ OrderStatus: orderstatus }).sort({ cDate: -1 }).toArray();
res.send(result);
});

//CÁC API LIÊN QUAN ĐẾN MY ACCOUNT - CUSTOMER
//API để truy xuất thông tin của một user có username nhất định
app.get("/customer/:username",cors(),async (req,res)=>{
const username = req.params.username;
const result = await userCollection.findOne({UserName:username, "UserType.TypeName": "Customer"});
if(result){
  res.send(result);
} else {
  res.status(404).send("User not found");
}
})
// API chỉnh sửa 1 User
app.put("/customer",cors(),async(req,res)=>{
  //update json product into database
  await userCollection.updateOne(
      {_id:new ObjectId(req.body._id)},//condition for update
      { $set: { //Field for updating
          FullName: req.body.FullName,
          Gender: req.body.Gender,
          DateOfBirth: req.body.DateOfBirth,
          Phone: req.body.Phone,
          Image: req.body.Image
        }
      }
  )
  var o_id = new ObjectId(req.body._id);
  const result = await userCollection.find({_id:o_id}).toArray();
  res.send(result[0])
})

//CÁC API LIÊN QUAN ĐẾN MY ACCOUNT - ADDRESS
//API lấy toàn bộ địa chỉ đỊa chỉ của một user dựa vào username
app.get("/address/list/:username", cors(), async (req, res) => {

  const username = req.params.username;
  const result = await userCollection.findOne({UserName:username});

  if (result) {
    const addressIds = result.Address; // Lấy mảng addressIds từ user
    addressCollection = database.collection("Address");
    
    // Chuyển đổi các string trong mảng addressIds thành Object ID
    const addressIdsObject = addressIds.map(id => new ObjectId(id));
    
    // Lấy toàn bộ địa chỉ dựa trên mảng addressIdsObject
    const addresses = await addressCollection.find({ _id: { $in: addressIdsObject } }).toArray();
      res.send(addresses);
  } else {
      res.status(404).send("User not found");
  }
}); 
// API thêm mới 1 Địa chỉ của 1 UserName
app.post("/address/:username", cors(), async (req, res) => {
const username = req.params.username;
const address = req.body;

const insertedAddress = await addressCollection.insertOne(address);
const insertedAddressId = insertedAddress.insertedId;

// Thêm _id của Address vào mảng Address[] trong User
const result = await userCollection.findOne({UserName:username});

if (result) {
  result.Address.push(insertedAddressId);
  await userCollection.updateOne(
    { UserName: username },
    { $set: { Address: result.Address } }
  );
  res.send(result.Address);
} else {
  res.status(404).send("User not found");
}
});

// API cập nhật lại AddressType của User
app.put("/address/setDefault/:username/:addressId", cors(), async (req, res) => {
const username = req.params.username;
const addressId = new ObjectId(req.params["addressId"]);

const user = await userCollection.findOne({ UserName: username });

if (!user) {
  return res.status(404).send("User not found");
}

const addressIds = user.Address.map(id => new ObjectId(id));

// Xóa đi trường AddressType của tất cả các địa chỉ
await addressCollection.updateMany(
  { _id: { $in: addressIds } },
  { $unset: { AddressType: "" } }
);

// Cập nhật AddressType của địa chỉ mới lên "Default"
await addressCollection.updateOne(
  { _id: addressId },
  { $set: { AddressType: "Default" } }
);

// Cập nhật AddressType của tất cả các địa chỉ còn lại thành trống
await addressCollection.updateMany(
  { _id: { $in: addressIds }, AddressType: { $ne: "Default" } },
  { $set: { AddressType: "" } }
);

return res.send("Address changed successfully");
});

// API lấy 1 địa chỉ của 1 _id
app.get("/address/:addressId", cors(), async (req, res) => {
try {
  const addressId = new ObjectId(req.params["addressId"]);
  const result = await addressCollection.findOne({ _id: addressId });
  if (!result) {
    return res.status(404).send("Address not found");
  } else return res.send(result)
}
catch (error) {
  console.log(error);
  res.status(500).send("Internal Server Error");
}
})

//API Cập nhật địa chỉ của 1 UserName
app.put("/address",cors(),async(req,res)=>{
//update json product into database
await addressCollection.updateOne(
    {_id:new ObjectId(req.body._id)},//condition for update
    { $set: { //Field for updating
        AddressName: req.body.AddressName,
        AddressPhone: req.body.AddressPhone,
        City: req.body.City,
        Town: req.body.Town,
        Ward: req.body.Ward,
        DetailAddress: req.body.DetailAddress
      }
    }
)
var o_id = new ObjectId(req.body._id);
const result = await addressCollection.find({_id:o_id}).toArray();
res.send(result[0])
})

// API Xoá 1 địa chỉ của 1 UserName
app.delete("/address/:username/:addressId", cors(), async (req, res) => {
try {
  const username = req.params.username;
  const addressId = new ObjectId(req.params["addressId"]);
  // Xóa địa chỉ từ bộ sưu tập Address
  const result = await addressCollection.find({_id:addressId}).toArray();
  //update json address into database
      await addressCollection.deleteOne(
          {_id:addressId}
      )
  await userCollection.updateOne({ UserName:username }, { $pull: { Address: addressId } });

  res.send("Address deleted successfully");
} catch (error) {
  console.log(error);
  res.status(500).send("An error occurred while deleting the address");
}
});

//CÁC API LIÊN QUAN ĐẾN MY ACCOUNT - MY ORDER
app.get("/order/list/:username", cors(), async (req, res) => {

const username = req.params.username;
const result = await userCollection.findOne({UserName:username});

if (result) {
  const orderIds = result.Order; // Lấy mảng orderIds từ user
  // Chuyển đổi các string trong mảng orderIds thành Object ID
  const orderIdsObject = orderIds.map(id => new ObjectId(id));
  
  // Lấy toàn bộ địa chỉ dựa trên mảng orderIdsObject
  const orders = await orderCollection.find({ _id: { $in: orderIdsObject } }).toArray();
    res.send(orders);
} else {
    res.status(404).send("User not found");
}
});

//CÁC API LIÊN QUAN ĐẾN MY ACCOUNT - MY VOUCHER
app.get("/voucher/list/:username", cors(), async (req, res) => {

const username = req.params.username;
const result = await userCollection.findOne({UserName:username});

if (result) {
  const voucherIds = result.Voucher; // Lấy mảng voucherIds từ user
  // Chuyển đổi các string trong mảng voucherIds thành Object ID
  const voucherIdsObject = voucherIds.map(id => new ObjectId(id));
  
  // Lấy toàn bộ địa chỉ dựa trên mảng voucherIdsObject
  const vouchers = await voucherCollection.find({ _id: { $in: voucherIdsObject } }).toArray();
    res.send(vouchers);
} else {
    res.status(404).send("User not found");
}
});

//CÁC API LIÊN QUAN ĐẾN MY ACCOUNT - MY PRODUCT
app.get("/product/list/:username", cors(), async (req, res) => {

const username = req.params.username;
const result = await userCollection.findOne({UserName:username});

if (result) {
  const productIds = result.Product; // Lấy mảng productIds từ user
  // Chuyển đổi các string trong mảng productIds thành Object ID
  const productIdsObject = productIds.map(id => new ObjectId(id));
  
  // Lấy toàn bộ địa chỉ dựa trên mảng productIdsObject
  const products = await productCollection.find({ _id: { $in: productIdsObject } }).toArray();
    res.send(products);
} else {
    res.status(404).send("User not found");
}
});

// CÁC API LIÊN QUAN ĐẾN QUẢN LÝ KHÁCH HÀNG ADMIN
// Join bảng User - Address - Order để làm trang Admin Quản lý khách hàng
async function getUsersWithAddressAndOrder() {
try {
  const users = await userCollection.aggregate([
    {
      $addFields: {
        AddressId: {
          $ifNull: [
            "$Address",
            null
          ]
        }
      }
    },
    {
      $addFields: {
        AddressId: {
          $map: {
            input: "$AddressId",
            as: "address",
            in: {
              $cond: {
                if: { $ne: [ "$$address", "" ] },
                then: { $toObjectId: "$$address" },
                else: null
              }
            }
          }
        }
      }
    },
    {
      $lookup: {
        from: "Address",
        localField: "AddressId",
        foreignField: "_id",
        as: "Address"
      }
    },
    {
      $addFields: {
        OrderId: {
          $ifNull: [
            "$Order",
            null
          ]
        }
      }
    },
    {
      $addFields: {
        OrderId: {
          $map: {
            input: "$OrderId",
            as: "order",
            in: {
              $cond: {
                if: { $ne: [ "$$order", "" ] },
                then: { $toObjectId: "$$order" },
                else: null
              }
            }
          }
        }
      }
    },
    {
      $lookup: {
        from: "Order",
        localField: "OrderId",
        foreignField: "_id",
        as: "Order"
      }
    },
    {
      $project: {
        AddressId: 0,
        OrderId: 0
      }
    }
  ]).toArray();
  return users;
} catch (err) {
  console.log(err);
  throw new Error("Internal Server Error");
}
}
// API lấy danh sách customer 
app.get("/customer-admin", cors(), async (req, res) => {
try {
  const users = await getUsersWithAddressAndOrder();
  const customers = users.filter(user => user.UserType.TypeName === "Customer");
  res.send(customers);
} catch (err) {
  console.log(err);
  res.status(500).send("Internal Server Error");
}
});
// API hiển thị thông tin của 1 Customer
app.get("/customer-admin/:id",cors(),async (req,res)=>{
var o_id = new ObjectId(req.params["id"]);
const result = await getUsersWithAddress().findOne({_id:o_id,"UserType.TypeName":"Customer"}).toArray();
res.send(result[0])
})
// API Xoá 1 Customer trong Admin QLKH
app.delete("/customer-admin/:id", cors(), async (req, res) => {
try {
  const o_id = new ObjectId(req.params["id"]);
  // Tìm User để trả về trong phản hồi sau khi xóa
  const result = await userCollection.findOne({_id: o_id, "UserType.TypeName": "Customer"});
  if (!result) {
    return res.status(404).send("User not found");
  }
  // Xóa User
  const deleteResult = await userCollection.deleteOne({_id: o_id});
  if (deleteResult.deletedCount === 0) {
    return res.status(500).send("Failed to delete User");
  }
  // Gửi phản hồi về User đã xóa
  res.send(result);
} catch (err) {
  console.log(err);
  res.status(500).send("Internal Server Error");
}
});