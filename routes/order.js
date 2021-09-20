var express = require('express')
var router = express.Router();

var User = require('../models/user');
var Commune= require('../models/commune');
var Ward= require('../models/ward');
var Bill = require('../models/bill');

router.get('/',function(req,res){
    
    var io=req.app.get('socketio')
    io.on('connection', (socket) =>{        
        socket.on('getcommunes', data => {
            var newCm = []            
            User.findOne({email: req.session.user},function(err,us){
                Commune.findOne({type:"commune"},function(err,commune){
                    for(var i=0;i<commune.communes.length;i++){
                        if (commune.communes[i].parent_code == data.message) newCm.push(commune.communes[i]);
                    }
                    io.emit('communes',{ 
                        message: newCm
                    })               
                })
            })
        })
    })
    
    User.findOne({email: req.session.user},function(err,us){
        Ward.findOne({type:"ward"},function(err,ward){            
            if (err) return console.log(err);
            res.render('order/orderShow',{
                us:us,
                ward: ward.wards,                    
                code: ""
            });            
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

router.post('/complete',function(req,res){
    var email= req.body.email;
    var city = req.body.city;
    var district = req.body.district;
    var commune = req.body.commune;
    var address_detail = req.body.address_detail;
    var note = req.body.note;
    var newDt="" ;
    var newCm="";

    Commune.findOne({type:"commune"},function(err,cm){
        if (err) return console.log(err);
        for (var i=0;i<cm.communes.length;i++){
            if (cm.communes[i].slug==commune) {
                newCm = cm.communes[i].name;
            }
        }
    })
    Ward.findOne({type:"ward"},function(err,wd){
        if (err) return console.log(err);
        for (var i=0;i<wd.wards.length;i++){
            if (wd.wards[i].code==district) {
                newDt = wd.wards[i].name;
            }
        }
    })

    User.findOne({email: email},function(err,us){
        if (err) return console.log(err);
        var bill = new Bill({
            email:email,
            note: note,
            address: address_detail + ', ' + newCm +', ' +newDt+', '+ 'thành phố ' + city ,
            type: 0,
            cart: us.cart,
        })
        bill.save(function(err){
            if (err) return console.log(err);
        })
        us.cart = [];
        us.save(function(err){
            if (err) return console.log(err);
            res.redirect('/purchase');
        })
    })
   
})


module.exports = router;