var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const prodctModel = require("./model/products");
const categoryModel = require("./model/category");
const userModel = require("./model/user");
var bcrypt = require('bcryptjs') 
const cookieParser = require("cookie-parser");
var session = require('express-session');
const bodyParser = require("body-parser")


var app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 

// app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


// creating session store

const mongodbURI = "mongodb://localhost:27017/mydb";
mongoose.connect(mongodbURI, {
  useNewUrlParser: true,

});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Mongodb Connected successfully");
});

const oneDay = 1000 * 24 * 60 * 60;

//session middleware
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: oneDay }, saveUninitialized: false, resave: false,}))

 // MIDDLEWARE 

 const Authenticate = (req, res, next) => {
  console.log("===========", req.session);
  if( req.session && req.session.isAuth == true ){
    next();
  }
  else {
    res.status(401)
.json({message: "Unauthorized user"}) 
 }
}

app.get("/", async (req, res, next) => {
  let Users = req.session.Users;
  let isAuth = req.session.isAuth;
  
  const products = await prodctModel.find()
  const categories = await categoryModel.find()
 
res.render("index", { category: categories , product: products, Users, isAuth});
  
});


app.get("/addproduct", Authenticate, (req, res, next) => {
  
  let Users = req.session.Users
   
  res.render("addproduct", {Users});
});


app.post("/addproductdata", async (req, res, next) => {
  var productdata = req.body;
  let Users = req.session.Users
  var UserId = Users._id
  productdata.userId = UserId;
  // var productWithUserid = { UserId, productdata }
  // console.log("productWithUserid ============", productdata);
  
  const product = new prodctModel(productdata);             //adding data to database by taking input from user
  await product.save();
 
    res.redirect("/");

});



app.get("/signup", (req, res, next) => {
  res.render("signup",);                                      //render to signup page
});


app.post("/user", async (req, res, next) => {
  const salt = bcrypt.genSaltSync(10);
  const secPass = await bcrypt.hash(req.body.password, salt); 

  var fdata = {  
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    telephone: req.body.telephone,
    email: req.body.email,
    password: secPass
  }
  
  const user = new userModel(fdata); 
  await user.save();
  res.redirect("/");
});


app.get("/signin", (req, res, next) => {
  res.render("signin");                                            // render to signin page
});


app.post("/login", async (req, res, next) => {
  // a variable to save a session
  const products = await prodctModel.find(); 
  const categories = await categoryModel.find();

  //taking email and password from user
var { email, password } = req.body;
// finding the email entered by the user in collection
 const Users = await userModel.findOne({email: email})
  
// need to compare user entered password with the hashed password stored in the database users collection
// comparing the entered password by user with the hashed password saved in database
 bcrypt.compare(password, Users.password, function(err, result) {
    if (result) {
      req.session.isAuth = true;
      req.session.Users = Users;
      req.session.save();
   
    res.render("useraccount",{ category: categories, product: products, Users });                           // signin api
  } else {

    res.render("error", { category: categories, product: products, Users}); 
  }
});

});


////////////////

app.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
})


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.send("err");
});

module.exports = app;
