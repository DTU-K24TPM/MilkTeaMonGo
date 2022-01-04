var Product = require('../models/product');
var User= require('../models/user');

module.exports = function(req,res,next){
        var check=true;
        User.findOne({email:req.session.user},function(err,us){
            if (err) return console.log(err);
            for (var i=0;i<us.cart.length;i++){
                Product.findOne({slug:us.cart[i].slug},function(err,p){
                    if (p.block==1) check=false;
                })
            }
        })
        setTimeout(() => {
            if (check==true) next();
            else res.render('error',{
                mes : 'Giỏ có món đã hết hàng'
            });
        }, 100);
}