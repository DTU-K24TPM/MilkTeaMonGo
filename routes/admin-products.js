var express = require('express')
var router = express.Router();
var mkdir = require('mkdirp');
var fs = require('fs-extra');
var fs2 = require('fs');
var resizeImg = require('resize-img');
var cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'thi', 
    api_key: '415314185911635', 
    api_secret: 'rle4Hc_E1Oe8dGx099O5xb7rASY',
    secure: true
  });

//get product model
var Product= require('../models/product');

var Category= require('../models/category');
var Bill=require('../models/bill');

router.get('/',function(req,res){
        Product.find({category:{'$ne':'size'}},function(err,products){
            if (err) return console.log(err);
            Category.find({slug:{'$ne':'size'} },function(err,cat){
            if (err) return console.log(err);
            res.render('admin/admin-products',{
                products: products,
                categories: cat
            })
        })
    })
})

// router.get('/add-product',function(req,res){
//     var title="";
//     var price="";

//     Category.find(function(err,cat){
//         res.render('admin/add-product',{
//             title: title,
//             categories: cat,
//             price: price
//         });
//     })
//     })

    

//post add page
router.post('/add-product',function(req , res){
    var imageFile =(req.files != null)? req.files.image.name:""; 
    var title=req.body.title;
    var slug = title.replace(/\s+/g,'-').toLowerCase();
    var price=req.body.price;
    var category = req.body.category;
    var quantity = req.body.quantity;
    if (req.files == null){
        res.send({noti:"Bạn chưa thêm hình ảnh"});
    } else {
        Product.findOne({slug: slug},function(err,product){
            if (product){
                req.flash('danger','Product title exists, choose another');
                var noti='Sản phẩm này đã tồn tại' ;
                res.send({noti: noti});
            }
            else {
                var price2=parseFloat(price).toFixed(2);
                    cloudinary.uploader.upload(req.files.image.tempFilePath,{folder:"milktea/products"},function(err,rs){
                        if (err) throw err;
                        var product=new Product({
                            title:title,
                            slug:slug,
                            price: price2,
                            category: category,
                            image: rs.url,
                            imageDrop: rs.public_id,
                            quantity: quantity,
                        });
                        fs2.unlink(req.files.image.tempFilePath,function(err){
                            if (err) throw err;
                        })
                        product.save(function(err){
                            if (err) throw err;
                            var noti="";
                            res.send({noti:noti})
                        });
                    })
                        // fs.mkdir('public/img/product_imgs/'+ product._id, function(err){
                        //     if (err) return console.log(err);
                        // });
        
                        // if (imageFile != ""){
                        //     var productImage =req.files.image;
                        //     var path= 'public/img/product_imgs/'+ product._id +'/' + imageFile;
        
                        //     productImage.mv(path,function(err){
                        //         if (err)return console.log(err)
                        //     });
                        // }
            }
        })
    }
})

//get edit product

// router.get('/edit-product/:id',function(req,res){

//     var errors;
//     if (req.session.errors) errors =req.session.errors;
//     req.session.errors = null;
   
//     Category.find(function(err,cat){
//         Product.findById(req.params.id, function(err,p){
//             if (err) {
//                 console.log(err);
//                 res.redirect('admin/products');
//             } else {
//                 res.render('admin/edit-product',{
//                     id: p._id,
//                     title: p.title,
//                     categories: cat,
//                     price: p.price,
//                     category: p.category.replace(/\s+/g,'-').toLowerCase(),
//                     image:p.image
//                 });
//             }
//         })
        
//     })

// })
router.post('/editBlock',function(req,res){
    var id = req.body.id;
    var block = req.body.block;
    Product.findById(id,function(err,p){
        if (err) return console.log(err);
        p.block=block;
        p.save(function(err){
            if (err) return console.log(err);
        })
    })
})

router.post('/editBtn',function(req,res){
    var id = req.body.id;
    Category.find({slug:{'$ne':'size'}},function(err,cats){
    Product.findById(id,function(err,p){
        if (err) return console.log(err);
        var htmlSelect ;
        cats.forEach(function(cat){ 
            htmlSelect=htmlSelect+`<option value="`+ cat.slug+ (cat.slug == p.category?`" selected="selected" >`:`"> `)+  cat.title+
            `</option>
         }); `
        })
        res.send({
            product : p,
            htmlSelect: htmlSelect
            })
        })
    })
})

router.post('/edit-product/:id',function(req,res){
    var imageFile =  (req.files != null)? req.files.image.name:""; 
    var title=req.body.title;
    var slug = title.replace(/\s+/g,'-').toLowerCase();
    var price=req.body.price;
    var category = req.body.category;
    var pimage = req.body.pimage;
    var id = req.params.id;
    var quantity = req.body.quantity;
    Product.findOne({slug: slug,_id : {'$ne':id}},function(err,p){
        if (err) console.log(err);
        if (p){
            var noti='Sản phẩm này đã tồn tại' ;
            res.send({noti: noti});
        } else {
            Product.findById(id,function(err,p){
                if (err) console.log(err);
                p.title= title;
                p.slug = slug;
                p.price=price;
                p.category = category;
                p.quantity = quantity;
                if (imageFile != ""){
                    cloudinary.uploader.upload(req.files.image.tempFilePath,{folder:"milktea/products"},function(err,rs){
                        p.image=rs.url;
                        p.imageDrop=rs.public_id;
                        if (err) throw err;
                        fs2.unlink(req.files.image.tempFilePath,function(err){
                            if (err) throw err;
                        })
                        cloudinary.uploader.destroy(pimage,function(err,rs){
                            if (err) throw err;
                        })
                        p.save(function(err){
                            if (err) throw err;
                            var noti="";
                            res.send({noti:noti, imageAjax:rs.url});
                        }); 
                    })
                }
                else {
                    p.save(function(err){
                        if (err)
                            console.log(err);
                        // if (imageFile != ""){
                        //     if (pimage != "" && pimage != imageFile){
                        //         fs.remove('public/img/product_imgs/'+id +'/'+ pimage,function(err){
                        //             if (err) console.log(err);
    
                        //         });
                        //     }
    
                        //     var productImage =req.files.image;
                        //     var path= 'public/img/product_imgs/'+ id +'/' + imageFile;
    
                        //     productImage.mv(path,function(err){
                        //         if (err)return console.log(err)
                        //     });
                        //     }
                            // var imageAjax;
                            // if (imageFile==""){
                            //     if (pimage != ""){
                            //          imageAjax= "/img/product_imgs/"+id+"/"+pimage;
                            //     }
                            //     else imageAjax="/img/noimage.jpg"
                            // }
                            // else {
                            //     imageAjax= "/img/product_imgs/"+id+"/"+imageFile;
                            // }
                                
                            res.send({
                                noti : "",
                                imageAjax:p.image,
                        })
                    })
                }
            })
        }
    })

})

router.get('/search-product',function(req,res){
    var name=req.query.search;
    Product.find({category:{'$ne':'size'}},function(err,products){
        if (err) return console.log(err);
        var newPd= products.filter(function(result){
            return result.title.toLowerCase().indexOf(name.toLowerCase()) !== -1;
        })
        Category.find({slug:{'$ne':'size'} },function(err,cat){
        if (err) return console.log(err);
        res.render('admin/admin-products',{
            products: newPd,
            categories: cat
        })
    })
  })
})

router.get('/delete-product/:id/:slug',function(req,res){
    var id =req.params.id;
    var slug=req.params.slug;
    Bill.findOne({"cart.slug":slug},function(err,bi){
        if (err) return console.log(err);
        if (bi){
                Product.findByIdAndRemove(id,function(err){
                    if (err) console.log(err);
                    res.redirect('/admin/products');
                });
                    
        } else {
                    Product.findByIdAndRemove(id,function(err){
                        if (err) console.log(err);
                    });
                    Product.findById(id,function(err,p){
                        cloudinary.uploader.destroy(p.imageDrop,function(err,rs){
                            if (err) throw err;
                        })
                    })
                    res.redirect('/admin/products');

        }
    })
    
})

module.exports = router;