var express = require('express')
var router = express.Router();

var User = require('../models/user');



router.get('/',function(req,res){
    User.findOne({email: req.session.user},function(err,us){
        if (err) return console.log(err);
        res.render('users/userShow',{
            us : us
        });
    })
   
})

router.get('/change-info',function(req,res){
    User.findOne({email: req.session.user},function(err,us){
        if (err) return console.log(err);
        res.render('users/userChange',{
            us : us
        });
    })
})

module.exports = router;