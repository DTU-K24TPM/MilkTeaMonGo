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
app.use(fileUpload({
  useTempFiles:true
}));

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
var adminUsers = require('./routes/admin-users');
var adminStatistics = require('./routes/admin-statistics')
var product = require('./routes/product')
var cart = require('./routes/cart')
var auth = require('./routes/auth')
var user = require('./routes/user')
var order = require('./routes/order')

var checkLogin = require('./middleware/checkLogin.middleware')
var checkUser = require('./middleware/checkUser.middleware');
var checkAdmin = require('./middleware/checkAdmin.middleware');
var checkBlockUser= require('./middleware/checkBlockuser.middleware');
// var checkCustomer = require('./middleware/checkCustomer.middleware')
var checkBlock=require('./middleware/checkBlock.middleware');
var purchase = require('./routes/purchase');

app.use('/admin/pages',checkLogin,checkBlockUser,checkAdmin,checkUser,adminPages);
app.use('/admin/categories',checkLogin,checkBlockUser,checkAdmin,checkUser,adminCategories);
app.use('/admin/products',checkLogin,checkBlockUser,checkAdmin,checkUser,adminProducts);
app.use('/admin/purchase',checkLogin,checkBlockUser,checkAdmin,checkUser,adminPurchase);
app.use('/admin/users',checkLogin,checkBlockUser,checkAdmin,checkUser,adminUsers);
app.use('/admin/statistics',checkLogin,checkBlockUser,checkAdmin,checkUser,adminStatistics);


app.use('/',checkUser,sites);
app.use('/product',checkBlockUser,checkUser,product);
app.use('/cart',checkBlockUser,checkUser,cart);
app.use('/auth',auth);
app.use('/user',checkLogin,checkBlockUser,checkUser,user);
app.use('/order',checkLogin,checkBlockUser,checkBlock,checkUser,order);
app.use('/purchase',checkLogin,checkBlockUser,checkUser,purchase);

app.set('socketio',io)

server.listen(process.env.PORT || 3000)

