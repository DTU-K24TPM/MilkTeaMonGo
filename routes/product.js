var express = require('express')
var router = express.Router();

var Product= require('../models/product');
var Category= require('../models/category');
router.get('/',function(req,res){
    Category.find({$and:[{slug : {'$ne': 'topping'}},{slug: {'$ne':'size'}}]},function(err,cats){
        Product.find({$and:[{category: {'$ne':'topping'}},{category: {'$ne':'size'}}]},function(err,products){
            res.render('products/show',{
                products: products,
                categories: cats
            });
        })
    })
})

router.get('/category/:slug',function(req,res){
    var slug= req.params.slug;
    Category.find({$and:[{slug : {'$ne': 'topping'}},{slug: {'$ne':'size'}}]},function(err,cats){
        Product.find({$and :[{category:slug},{category: {'$ne':'topping'}},{category: {'$ne':'size'}}]},function(err,products){
            res.render('products/show',{
                products: products,
                categories: cats
            });
        })
    })
})

router.get('/:slug',function(req,res){
    var slug = req.params.slug;
    Product.findOne({slug: slug},function(err,product){
        Product.find({$and:[{category: 'topping'},{block:0}]},function(err,toppings){
            Product.find({category: 'size'},function(err,sizes){
                Product.aggregate([{ $match: { $and:[{block:0},{category: {'$ne': 'topping'}},{category: {'$ne':'size'}},
                {category: {'$ne':'ăn-vặt'}}]}},{ $sample: { size: 8 } }],function(err,slides){
                    if (product){
                        if (product.category =='ăn-vặt'){
                            res.render('products/detail',{
                                product: product,
                                toppings: 0,
                                sizes: sizes,
                                slides: slides
                            })
                        }else {
                            res.render('products/detail',{
                                product: product,
                                toppings: toppings,
                                sizes: sizes,
                                slides: slides
                            })
                        }
                    } else {
                        res.render('products/unknown');
                    }
                    
                })                
            })
        })
    })


})
module.exports = router;