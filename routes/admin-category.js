var express = require('express')
var router = express.Router();

var Category= require('../models/category');

router.get('/',function(req,res){
    Category.find(function(err,categories){
        if (err) return console.log(err);
        res.render('admin/categories',{
            categories: categories,
        })
    })
})
//test
router.get('/add-category',function(req,res){
    var title="";

    res.render('admin/add-category',{
        title: title,
    });
})

//post add page
router.post('/add-category',function(req,res){
    var title=req.body.title;
    var slug = title.replace(/\s+/g,'-').toLowerCase();
    var content=req.body.content;
    
    Category.findOne({slug: slug},function(err,cat){
        if (cat){
            req.flash('danger','Category slug exists, choose another');
            res.render('admin/add-category',{
                title: title,
            });
        }
        else {
            var cat=new Category({
                title:title,
                slug:slug,
            });
            cat.save(function(err){
                if (err) return console.log(err);
                req.flash('succsess','Category added');
                res.redirect('/admin/categories');
            })
        }
    })

})

//POST reorder pages
router.post('/reorder-pages',function(req,res){
    var ids= req.body['id[]'];

    var count = 0;

    for(var i=0;i<ids.length;i++){
        var id = ids[i];
        count++;

        (function(count){
            Page.findById(id,function(err,page){
                page.sorting=count;
                page.save(function(err){
                    if (err) console.log(err);
                })
            })
        }) (count); 
        
    }
})

router.get('/edit-category/:id',function(req,res){
   Category.findById(req.params.id,function(err,cat){
       if (err) return console.log(err);
       res.render('admin/edit-category',{
        title: cat.title,
        id: cat._id
       })
   })

})

//post edit page
router.post('/edit-category/:id',function(req,res){
    var title=req.body.title;
    var slug = title.replace(/\s+/g,'-').toLowerCase();
    var id= req.params.id;
    
    Category.findById({slug: slug, _id: {'$ne':id}},function(err,cat){
        if (cat){
            req.flash('danger','Page slug exists, choose another');
            res.render('admin/edit-category',{
                title: title,
                id: id
            });
        }
        else {
            Category.findById(id,function(err,cat){
                if (err) return console.log(err);
                cat.title= title;
                cat.slug= slug;

                cat.save(function(err){
                    if (err) return console.log(err);
                    req.flash('succsess','Page editted');
                    res.redirect('/admin/categories');
                })
            });
            
        }
    })

})

router.get('/delete-category/:id',function(req,res){
    Category.findByIdAndRemove(req.params.id,function(err){
        if (err) return console.log(err);
        req.flash('succsess','Page deleteted');
        res.redirect('/admin/categories');
    })
})

module.exports = router;