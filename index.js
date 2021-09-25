var express =  require('express');
var path = require ('path');
var mongoose = require('mongoose');
var config = require('./config/database');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var fileUpload = require('express-fileupload');

//conect db
mongoose.connect(config.database);
var db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));
db.once('open',function(){
    console.log('connected to mongodb')
});

var app = express();
var server = require('http').Server(app)
var io = require('socket.io')(server)
//view engine setup
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');

//setup public folder
app.use(express.static(path.join(__dirname,'public')));

//express fileupload middleware
app.use(fileUpload());

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

//parse application/json
app.use(bodyParser.json())

//express-session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: { 
      secure: false,
      maxAge: 1800000
    }
  }));

// express validator middleware
// app.use(expressValidator({
//     errorFormatter: function(param,msg,value){
//         var namespace = param.split('.')
//         ,root = namespace.shift()
//         ,formParam = root;

//         while(namespace.length){
//             formParam += '[' + namespace.shift() + ']';
//         }
//         return {
//             param : formParam,
//             msg : msg,
//             value : value
//         };
//     }
// }));

//express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('*',function(req,res,next){
  res.locals.cart = req.session.cart;
  next();
})

var sites = require('./routes/sites')
var adminPages = require('./routes/admin-pages')
var adminCategories = require('./routes/admin-category')
var adminProducts = require('./routes/admin-products')
var adminPurchase = require('./routes/admin-purchase')
var product = require('./routes/product')
var cart = require('./routes/cart')
var auth = require('./routes/auth')
var user = require('./routes/user')
var order = require('./routes/order')
var checkLogin = require('./middleware/checkLogin.middleware')
var checkUser = require('./middleware/checkUser.middleware');
var purchase = require('./routes/purchase');

app.use('/admin/pages',checkUser,adminPages);
app.use('/admin/categories',checkUser,adminCategories);
app.use('/admin/products',checkUser,adminProducts);
app.use('/admin/purchase',checkUser,adminPurchase);
app.use('/',checkUser,sites);
app.use('/product',checkUser,product);
app.use('/cart',checkUser,cart);
app.use('/auth',auth);
app.use('/user',checkLogin,checkUser,user);
app.use('/order',checkLogin,order);
app.use('/purchase',checkLogin,purchase);

app.set('socketio',io)

server.listen(3000)

