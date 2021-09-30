var express = require('express')
var router = express.Router();

var checkCustomer = require('../middleware/checkCustomer.middleware')
var checkUser = require('../middleware/checkUser.middleware');
var Product= require('../models/product');
var Category= require('../models/category');



router.get('/',checkCustomer,checkUser,function(req,res){
    Category.find({$and:[{slug : {'$ne': 'topping'}},{slug: {'$ne':'size'}}]},function(err,cats){        
        Product.aggregate([{ $match: { $and:[{block:0},{category: {'$ne': 'topping'}},{category: {'$ne':'size'}},{category: {'$ne':'ăn-vặt'}}]}}
        ,{ $sample: { size: 7 } }],function(err,products){            
            res.render('index',{
                products: products,
                categories: cats 
            });
        })
    })
})

router.get('/search',checkCustomer,checkUser,function(req,res){
    var p= req.query.product;
    Category.find({$and:[{slug : {'$ne': 'topping'}},{slug: {'$ne':'size'}}]},function(err,cats){
        Product.find({$and:[{block:0},{category: {'$ne': 'topping'}},{category: {'$ne':'size'}}]},function(err,products){
            var newProducts = products.filter(function(result){
                return result.title.toLowerCase().indexOf(p.toLowerCase()) !== -1;
            })
            res.render('products/show',{
                products: newProducts,
                categories: cats
            });
        })
    })
})

module.exports = router;