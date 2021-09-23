var express = require('express')
var router = express.Router();

var Bill = require('../models/bill');
var User = require('../models/user');


router.get('/',function(req,res){
    var fullname =[];
    Bill.find(function(err,b){
        if (err) return console.log(err);
        for (var i=0;i<b.length;i++){
            User.findOne({email: b[i].email},function(err,us){
                if (err) return console.log(err);
                fullname.push(us.fullname) ;
            })
        }
        res.render('admin/admin-purchase',{
            bills: b,
            fullnames: fullname
        })
    })
})



module.exports = router;