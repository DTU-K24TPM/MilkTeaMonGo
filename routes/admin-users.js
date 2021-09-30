var express = require('express')
var router = express.Router();


//get product model
var fs = require('fs-extra');
var User= require('../models/user');


router.get('/',function(req,res){
    User.find({admin: 0},function(err,us){
        if (err) return console.log(err);
        res.render('admin/admin-users',{
            users : us
        })
    })
})

router.post('/editBlock',function(req,res){
    var id = req.body.id;
    var block = req.body.block;
    User.findById(id,function(err,us){
        if (err) return console.log(err);
        us.block=block;
        us.save(function(err){
            if (err) return console.log(err);
        })
    })
})

router.get('/delete-user/:id',function(req,res){
    var id =req.params.id;
    var path;
    User.findById(id,function(err,us){
        if (err) return console.log(err);
         path = 'public/img/users/'+ us.email;
         fs.remove(path,function(err){
            if (err) return console.log(err);
        })
    })
    User.findByIdAndRemove(id,function(err){
     if (err) console.log(err);
    });
    res.redirect('/admin/users');
        
    })


module.exports = router;