var express = require('express')
var router = express.Router();

var Bill = require('../models/bill');
var User = require('../models/user');


router.get('/',function(req,res){
    Bill.find(function(err,b){
        if (err) return console.log(err);
        res.render('admin/admin-purchase',{
            bills: b,
        })
    })
})



module.exports = router;