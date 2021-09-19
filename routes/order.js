var express = require('express')
var router = express.Router();

var User = require('../models/user');
var Commune= require('../models/commune');
var Ward= require('../models/ward');

router.get('/',function(req,res){
    User.findOne({email: req.session.user},function(err,us){
        Ward.findOne({type:"ward"},function(err,ward){
            Commune.findOne({type:"commune"},function(err,commune){
                if (err) return console.log(err);
                res.render('order/orderShow',{
                    us:us,
                    ward: ward.wards,
                    commune: commune.communes,
                    code: ""
                        });
            })
        })
    })
})

router.post('/ward/:code',function(req,res){

    var code=req.params.code;
    var newCm = [];
    User.findOne({email: req.session.user},function(err,us){
        Ward.findOne({type:"ward"},function(err,ward){
            Commune.findOne({type:"commune"},function(err,commune){

                for(var i=0;i<commune.communes.length;i++){
                    if (commune.communes[i].parent_code == code) newCm.push(commune.communes[i]);
                }
                if (err) return console.log(err);
                res.render('order/orderShow',{
                    us:us,
                    ward: ward.wards,
                    commune: newCm,
                    code : code
                        });
            })
        })
    })
})
module.exports = router;