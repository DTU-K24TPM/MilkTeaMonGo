var express = require('express')
var router = express.Router();

var User= require('../models/user');
var Product= require('../models/product');
var Category= require('../models/category');

var checkLogin = require('../middleware/checkLogin.middleware')

//post add to cart

router.post('/add/:slug',checkLogin,function(req,res){
    var topping = req.body.topping    
    var quantity = req.body.quantity  
    var ice = req.body.ice  
    var productId = req.body.productId  
    var size = req.body.size
    var slug = req.params.slug;
    var title= "";

    if (req.session.user){
        User.findOne({email: req.session.user},function(err,us){
            if (err) return console.log(err);
            req.session.cart=us.cart;
            us.save(function(err){
                if (err) console.log(err);
            })
        })
    }
    Product.findOne({slug: slug},function(err,p){
        if (err) return console.log(err);
        title=p.title;
        if (typeof req.session.cart == "undefined") {
            req.session.cart=[];
            var idCart=req.session.cart.length;
            req.session.cart.push({
                title: title,
                topping: topping,
                ice: ice,
                size: size,
                quantity: quantity,
                price: p.price,
                image: '/img/product_imgs/'+p._id + '/'+p.image,
                idCart: idCart
            });
        }
        else {
            var check= true;
            var idCart = 1;
            var cart =req.session.cart;
            var newItem= true;
            for (var i=0;i<cart.length;i++){
                if (idCart== cart[i].idCart) idCart++;
                if (cart[i].title==title && cart[i].topping==topping && cart[i].size==size && cart[i].ice==ice) {
                    cart[i].quantity++;
                    newItem=false;
                    break;
                }
            }

            if (newItem) {
                req.session.cart.push({
                    title: title,
                    topping: topping,
                    ice: ice,
                    size: size,
                    quantity: quantity,
                    price: p.price,
                    image: '/img/product_imgs/'+p._id + '/'+p.image,
                    idCart: idCart
                });
            }
        }
        if (typeof req.session.user != "undefined"){
            User.findOne({email: req.session.user},function(err,us){
                if (err) return console.log(err);
                us.cart=req.session.cart;
                us.save(function(err){
                    if (err) console.log(err);
                })
            })
        }
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
// //     if (!req.session.user){
// //     if (req.session.cart && req.session.cart.length==0){
// //         delete req.session.cart;
// //     }
// //     res.render('cart/show',{
// //         cart: req.session.cart
// //     });
// // }
// else {}
    User.findOne({email: req.session.user},function(err,us){
        req.session.cart= us.cart;
        res.render('cart/show',{
            cart: us.cart
        });
    })
})

module.exports = router;