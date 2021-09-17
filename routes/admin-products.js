var express = require('express')
var router = express.Router();
var mkdir = require('mkdirp');
var fs = require('fs-extra');
var resizeImg = require('resize-img')

//get product model
var Product= require('../models/product');

var Category= require('../models/category');

router.get('/',function(req,res){
    Product.count(function(err,c){
        Product.find(function(err,products){
            res.render('admin/products',{
                products: products,
                count: c
            })
        })
    })

    
})

router.get('/add-product',function(req,res){
    var title="";
    var price="";

    Category.find(function(err,cat){
        res.render('admin/add-product',{
            title: title,
            categories: cat,
            price: price
        });
    })
    })

    

//post add page
router.post('/add-product',function(req , res){
    var imageFile = typeof req.files.image !== "undefined"? req.files.image.name:""; 
    var title=req.body.title;
    var slug = title.replace(/\s+/g,'-').toLowerCase();
    var price=req.body.price;
    var category = req.body.category;
    
    Product.findOne({slug: slug},function(err,product){
        if (product){
            req.flash('danger','Product title exists, choose another');
            Category.find(function(err,cat){
                res.render('admin/add-product',{
                    title: title,
                    categories: cat,
                    price: price
                });
            })
        }
        else {
            var price2=parseFloat(price).toFixed(2);
            var product=new Product({
                title:title,
                slug:slug,
                price: price2,
                category: category,
                image: imageFile
            });
            product.save(function(err){
                if (err) return console.log(err);

                fs.mkdir('public/img/product_imgs/'+ product._id, function(err){
                    if (err) return console.log(err);
                });

                if (imageFile != ""){
                    var productImage =req.files.image;
                    var path= 'public/img/product_imgs/'+ product._id +'/' + imageFile;

                    productImage.mv(path,function(err){
                        if (err)return console.log(err)
                    });
                }
                req.flash('succsess','Product added');
                res.redirect('/admin/products')
            })
        }
    })

})

//get edit product

router.get('/edit-product/:id',function(req,res){

    var errors;
    if (req.session.errors) errors =req.session.errors;
    req.session.errors = null;
   
    Category.find(function(err,cat){
        Product.findById(req.params.id, function(err,p){
            if (err) {
                console.log(err);
                res.redirect('admin/products');
            } else {
                res.render('admin/edit-product',{
                    id: p._id,
                    title: p.title,
                    categories: cat,
                    price: parseFloat(p.price).toFixed(2),
                    category: p.category.replace(/\s+/g,'-').toLowerCase(),
                    image:p.image
                });
            }
        })
        
    })

})

//post edit page
router.post('/edit-product/:id',function(req,res){
    var imageFile = typeof req.files.image !== "undefined"? req.files.image.name:""; 
    var title=req.body.title;
    var slug = title.replace(/\s+/g,'-').toLowerCase();
    var price=req.body.price;
    var category = req.body.category;
    var pimage = req.body.pimage;
    var id = req.params.id;
    Product.findOne({slug: slug,_id : {'$ne':id}},function(err,p){
        if (err) console.log(err);
        if (p){
            req.flash('danger','Product title exists, choose another');
            res.redirect('admin/products/edit-product/'+ id);
        } else {
            Product.findById(id,function(err,p){
                if (err) console.log(err);
                p.title= title;
                p.slug = slug;
                p.price=parseFloat(price).toFixed(2);
                p.category = category;
                if (imageFile != ""){
                    p.image= imageFile;
                }
                p.save(function(err){
                    if (err)
                        console.log(err);
                    if (imageFile != ""){
                        if (pimage != "" && pimage != imageFile){
                            fs.remove('public/img/product_imgs/'+id +'/'+ pimage,function(err){
                                if (err) console.log(err);

                            });
                        }

                        var productImage =req.files.image;
                        var path= 'public/img/product_imgs/'+ id +'/' + imageFile;

                        productImage.mv(path,function(err){
                            if (err)return console.log(err)
                        });
                        }
                        req.flash('succsess','Product editted');
                        res.redirect('/admin/products')
                })
            })
        }
    })

})

router.get('/delete-product/:id',function(req,res){
    var id =req.params.id;
    var path = 'public/img/product_imgs/'+ id;
    fs.remove(path,function(err){
        if (err) console.log(err);
        else {
            Product.findByIdAndRemove(id,function(err){
                if (err) console.log(err);
            });
            req.flash('success','Product deleted ');
            res.redirect('/admin/products');
        }
    })
})

module.exports = router;