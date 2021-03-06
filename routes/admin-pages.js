var express = require('express')
var router = express.Router();

var Page= require('../models/page');

router.get('/',function(req,res){
    Page.find({}).sort({sorting:1}).exec(function(err,pages){
        res.render('admin/pages',{
            pages: pages,

        })
    })
})

router.get('/add-page',function(req,res){
    var title="";
    var slug="";
    var content="";

    res.render('admin/add-page',{
        title: title,
        slug: slug,
        content: content
    });
})

//post add page
router.post('/add-page',function(req,res){
    var title=req.body.title;
    var slug=req.body.slug.replace(/\s+/g,'-').toLowerCase();
    if (slug== "") slug = title.replace(/\s+/g,'-').toLowerCase();
    var content=req.body.content;
    
    Page.findOne({slug: slug},function(err,page){
        if (page){
            req.flash('danger','Page slug exists, choose another');
            res.render('admin/add-page',{
                title: title,
                slug: slug,
                content: content
            });
        }
        else {
            var page=new Page({
                title:title,
                slug:slug,
                content:content,
                sorting:100
            });
            page.save(function(err){
                if (err) return console.log(err);
                req.flash('succsess','Page added');
                res.redirect('/admin/pages');
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

router.get('/edit-page/:slug',function(req,res){
   Page.findOne({slug: req.params.slug},function(err,page){
       if (err) return console.log(err);
       res.render('admin/edit-page',{
        title: page.title,
        slug: page.slug,
        content: page.content,
        id: page._id
       })
   })

})

//post edit page
router.post('/edit-page/:slug',function(req,res){
    var title=req.body.title;
    var slug=req.body.slug.replace(/\s+/g,'-').toLowerCase();
    if (slug== "") slug = title.replace(/\s+/g,'-').toLowerCase();
    var content=req.body.content;
    var id= req.body.id;
    
    Page.findOne({slug: slug, _id: {'$ne':id}},function(err,page){
        if (page){
            req.flash('danger','Page slug exists, choose another');
            res.render('admin/edit-page',{
                title: title,
                slug: slug,
                content: content,
                id: id
            });
        }
        else {
            Page.findById(id,function(err,page){
                if (err) return console.log(err);
                page.title= title;
                page.slug= slug;
                page.content = content;

                page.save(function(err){
                    if (err) return console.log(err);
                    req.flash('succsess','Page editted');
                    res.redirect('/admin/pages');
                })
            });
            
        }
    })

})

router.get('/delete-page/:id',function(req,res){
    Page.findByIdAndRemove(req.params.id,function(err){
        if (err) return console.log(err);
        req.flash('succsess','Page deleteted');
        res.redirect('/admin/pages');
    })
})

module.exports = router;