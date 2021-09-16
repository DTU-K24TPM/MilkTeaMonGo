var express = require('express')
var router = express.Router();

var User= require('../models/user');
var Product= require('../models/product');
var Category= require('../models/category');

var checkLogin = require('../middleware/checkLogin.middleware')


//function equal array
function equalTopping(a,b){
    if (a.length == b.length && b.length ==0) return true;
    if (a.length != b.length) return false;
    for (var i=0;i<a.length;i++){
        if (a[i].title != b[i].title || a[i].price!=b[i].price) return false;
    }
    return true;
}

//post add to cart
router.post('/add/:slug',checkLogin,function(req,res){
    var topping = req.body.topping;
    var newTp=[];
    if (topping) {
        if (typeof topping== "string"){
            Product.findOne({slug: topping},function(err,tp){
                if (err) return console.log(err);
                if(tp){
                newTp.push({
                    title:tp.slug,
                    price:tp.price
                })
            }
            })
        }
        else {
            for(var i=0;i<topping.length;i++){
                Product.findOne({slug: topping[i]},function(err,tp){
                    if (err) return console.log(err);
                    if (tp){
                    newTp.push({
                        title:tp.slug,
                        price:tp.price
                    })
                }
                })
            }
        }
    }

    var quantity = req.body.quantity  
    var ice = req.body.ice  
    var productId = req.body.productId  
    var size = req.body.size
    var slug = req.params.slug;
    var title= "";
        User.findOne({email: req.session.user},function(err,us){
            if (err) return console.log(err);
            req.session.cart=us.cart;
            us.save(function(err){
                if (err) console.log(err);
            })
        })
    Product.findOne({slug: slug},function(err,p){
        if (err) return console.log(err);
        title=p.title;
        if (typeof req.session.cart == "undefined") {
            req.session.cart=[];
            var idCart=req.session.cart.length;
            req.session.cart.push({
                title: title,
                topping: newTp,
                ice: ice,
                size: size,
                quantity: quantity,
                price: p.price,
                image: '/img/product_imgs/'+p._id + '/'+p.image,
                idCart: idCart
            });
        }
        else {
            var idCart = 1;
            var cart =req.session.cart;
            var newItem= true;
            for (var i=0;i<cart.length;i++){
                if (idCart== cart[i].idCart) idCart++;
                if (cart[i].title==title && (equalTopping(cart[i].topping,newTp)==true) && cart[i].size==size && cart[i].ice==ice) {
                    cart[i].quantity++;
                    newItem=false;
                    break;
                }
            }

            if (newItem) {
                req.session.cart.push({
                    title: title,
                    topping: newTp,
                    ice: ice,
                    size: size,
                    quantity: quantity,
                    price: p.price,
                    image: '/img/product_imgs/'+p._id + '/'+p.image,
                    idCart: idCart
                });
            }
        }
            User.findOne({email: req.session.user},function(err,us){
                if (err) return console.log(err);
                us.cart=req.session.cart;
                us.save(function(err){
                    if (err) console.log(err);
                })
            })
        req.flash('success','product added');
        res.redirect('back');
    })
})


router.get('/update/:idcart',function(req,res){
    var id = req.params.idcart;
    var cart=req.session.cart;
    var action = req.query.action;
    for (var i=0;i<cart.length;i++){
        if (cart[i].idCart== id){
            switch(action){
                case "add":cart[i].quantity++; break;
                case "remove": cart[i].quantity--; if(cart[i].quantity==0) cart.splice(i,1) ;break;
                case "clear": cart.splice(i,1); if (cart.length == 0) delete req.session.cart; break;
                default: console.log('err'); break;
            }
            break;
        }
    }
    if (req.session.user){
        User.findOne({email: req.session.user},function(err,us){
            if (err) return console.log(err);
            us.cart=req.session.cart;
            us.save(function(err){
                if (err) console.log(err);
            })
        })
    }
    res.redirect('/cart');
})

//get cart
router.get('/',checkLogin,function(req,res){
    User.findOne({email: req.session.user},function(err,us){
        req.session.cart= us.cart;
        if (req.session.cart.length==0) delete req.session.cart;
        res.render('cart/show',{
            cart: req.session.cart
        });
    })
})

module.exports = router;