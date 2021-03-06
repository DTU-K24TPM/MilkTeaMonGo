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
            if(us){
                req.session.cart=us.cart;
                us.save(function(err){
                    if (err) console.log(err);
                })
            }            
        })
        setTimeout(() => {
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
                        image: p.image,
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
                            image: p.image,
                            idCart: idCart
                        });
                    }
                }
                    User.findOne({email: req.session.user},function(err,us){
                        if (err) return console.log(err);
                        if(us){
                            us.cart=req.session.cart;
                            us.save(function(err){
                                if (err) console.log(err);
                            })
                        }                
                    })
                res.redirect('back');
            })
        }, 10);
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
        if(us){
            us.cart=req.session.cart;
            us.save(function(err){
                if (err) console.log(err);
            })
        }
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
            if(us){
                us.cart=req.session.cart;
                us.save(function(err){
                    if (err) console.log(err);
                })
            }
        })
    }
    var cartNone = `<div class="dh-frame dh-empty">
    <img class="img-empty" src="/img/buy1.gif">
    <h4 class="empty-cart">Gi??? h??ng c???a b???n ??ang tr???ng, h??y l???a ch???n s???n ph???m nh??</h4>
    <div class="btn-empty">
    
        <a href="/product"><button type="button" class="btn btn-secondary btn-cont">
            Ti???p t???c mua h??ng
        </button></a>
        
    </div>
</div>`

var check = false;
if (req.session.cart){   
    for(var i=0;i<req.session.cart.length;i++)
    {
       Product.findOne({slug: req.session.cart[i].slug},function(err,pd){
           if (err) return console.log(err);
          if (pd.block==1) {check = true;  }
       })
    }
}
    setTimeout(function(){
        res.send({
            quantity: qty,
            lengthh: lengthh,
            cartNone:cartNone,
            check: check
        });
        },50) 
    
})

//get cart
router.get('/',function(req,res){
    User.findOne({email: req.session.user},function(err,us){
        if(us) req.session.cart= us.cart;
        if (req.session.cart && req.session.cart.length==0) delete req.session.cart;
        
    })
    var block = [];
    
    if (req.session.cart){   
    for(var i=0;i<req.session.cart.length;i++)
    {
       Product.findOne({slug: req.session.cart[i].slug},function(err,pd){
        block.push(pd.block);
       })
    }
}
    setTimeout(function(){
        res.render('cart/show',{
        cart: req.session.cart,
        block: block
    });},50) 
    

})

module.exports = router;