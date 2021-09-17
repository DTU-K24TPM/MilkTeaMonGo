var express = require('express')
var router = express.Router();

var Product= require('../models/product');
var Category= require('../models/category');



router.get('/',function(req,res){
Product.find({$and:[{category: {'$ne':'topping'}},{category: {'$ne':'size'}}]},function(err,p){
    Category.find({$and:[{slug : {'$ne': 'topping'}},{slug: {'$ne':'size'}}]},function(err,cats){
        res.render('index',{
            categories: cats, 
            products: p
            });
        })
    })
})

router.get('/search',function(req,res){
    var p= req.query.product;
    Category.find({slug : {'$ne': 'topping'}},function(err,cats){
        Product.find({category: {'$ne':'topping'}},function(err,products){
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