var express = require('express')

var shortid = require('shortid')
var router = express.Router();

var User= require('../models/user');
var Product= require('../models/product');
var Category= require('../models/category');



//function equal array Topping
function equalTopping(a,b){
    if (a.length == b.length && b.length ==0) return true;
    if (a.length != b.length) return false;
    for (var i=0;i<a.length;i++){
        if (a[i].title != b[i].title || a[i].price!=b[i].price) return false;
    }
    return true;
}

//post add to cart
router.post('/add/:slug',function(req,res){
    var topping = req.body.topping;
    var newTp=[];
    if (topping) {
        if (typeof topping== "string"){
            Product.findOne({slug: topping},function(err,tp){
                if (err) return console.log(err);
                if(tp){
                newTp.push({
                    title:tp.title,
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
                        title:tp.title,
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
    var newSz={};

    Product.findOne({title: size},function(err,sz){
        if (err) return console.log(err);
        newSz = sz;
    })
    var slug = req.params.slug;
    var title= "";
    var idCart = shortid.generate();
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
            req.session.cart.push({
                title: title,
                slug:p.slug,
                topping: newTp,
                ice: ice,
                size: newSz,
                quantity: quantity,
                price: p.price,
                image: '/img/product_imgs/'+p._id + '/'+p.image,
                idCart: idCart
            });
        }
        else {
            var cart =req.session.cart;
            var newItem= true;
            for (var i=0;i<cart.length;i++){
                if (cart[i].title==title && (equalTopping(cart[i].topping,newTp)==true) && cart[i].size.slug==newSz.slug && cart[i].ice==ice) {
                    cart[i].quantity-=(-quantity);
                    newItem=false;
                    break;
                }
            }

            if (newItem) {
                req.session.cart.push({
                    title: title,
                    slug:p.slug,
                    topping: newTp,
                    ice: ice,
                    size: newSz,
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
        res.redirect('back');
    })
})

router.get('/clear/:idcart',function(req,res){
    var id = req.params.idcart;
    var cart=req.session.cart;
    for (var i=0;i<cart.length;i++){
        if (cart[i].idCart== id){
         { cart.splice(i,1); if (cart.length == 0) delete req.session.cart; break; }
        }
    }
    User.findOne({email: req.session.user},function(err,us){
        if (err) return console.log(err);
        us.cart=req.session.cart;
        us.save(function(err){
            if (err) console.log(err);
        })
    })
    res.redirect('back');
})
router.post('/update/:idcart',function(req,res){
    var id = req.params.idcart;
    var cart=req.session.cart;
    var action = req.body.action;
    var qty ;
    var lengthh;
    for (var i=0;i<cart.length;i++){
        if (cart[i].idCart== id){
            switch(action){
                case "add":cart[i].quantity++; qty=cart[i].quantity; break;
                case "remove": cart[i].quantity--;qty=cart[i].quantity; if(cart[i].quantity==0) cart.splice(i,1);  break;
                default: console.log('err'); break;
            }
            break;
        }
    }
    lengthh = req.session.cart.length;
    if (req.session.user){
        User.findOne({email: req.session.user},function(err,us){
            if (err) return console.log(err);
            us.cart=req.session.cart;
            us.save(function(err){
                if (err) console.log(err);
            })
        })
    }
    var cartNone = `<div class="dh-frame dh-empty">
    <img class="img-empty" src="/img/buy1.gif">
    <h4 class="empty-cart">Giỏ hàng của bạn đang trống, hãy lựa chọn sản phẩm nhé</h4>
    <div class="btn-empty">
    
        <a href="/product"><button type="button" class="btn btn-secondary btn-cont">
            Tiếp tục mua hàng
        </button></a>
        
    </div>
</div>`
    res.send({
        quantity: qty,
        lengthh: lengthh,
        cartNone:cartNone
    });
})

//get cart
router.get('/',function(req,res){
    User.findOne({email: req.session.user},function(err,us){
        req.session.cart= us.cart;
        if (req.session.cart.length==0) delete req.session.cart;
        res.render('cart/show',{
            cart: req.session.cart
        });
    })
})

module.exports = router;