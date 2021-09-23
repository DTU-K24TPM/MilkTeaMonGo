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
            });            
        })
    })
})

// router.post('/ward/:code',function(req,res){
//     var code=req.params.code;
//     var newCm = [];
//     User.findOne({email: req.session.user},function(err,us){
//         Ward.findOne({type:"ward"},function(err,ward){
//             Commune.findOne({type:"commune"},function(err,commune){

//                 for(var i=0;i<commune.communes.length;i++){
//                     if (commune.communes[i].parent_code == code) newCm.push(commune.communes[i]);
//                 }
//                 if (err) return console.log(err);
//                 res.render('order/orderShow',{
//                     us:us,
//                     ward: ward.wards,
//                     commune: newCm,
//                     code : code
//                         });
//             })
//         })
//     })
// })
function formatDate(d){
    var yyyy= d.getFullYear();
    var mm= d.getMonth();
    var datee = d.getDate();
    var hh= d.getHours();
    var m= d.getMinutes();
    var s= d.getSeconds();
    var dayy = d.getDay();
    var dayyVN;
    if (dayy<7) dayyVN ="Thứ "+(dayy+1); 
    else dayyVN = "Chủ nhật";
    return (String(dayyVN+" ngày "+(datee)+" tháng "+(mm+1)+" năm "+yyyy+", "+hh+":"+m+":"+s));
}
router.post('/complete',function(req,res){
    var email= req.body.email;
    var city = req.body.city;
    var ward = req.body.ward;
    var commune = req.body.commune;
    var address_detail = req.body.address_detail;
    var note = req.body.note;
    var newDt="" ;
    var newCm="";
    var totalPrice = req.body.totalPrice;
    var name= req.body.name;

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
            if (wd.wards[i].code==ward) {
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
            type: "wait-confirm",
            cart: us.cart,
            totalPrice: totalPrice,
            name: name,
            dateVN: formatDate(new Date())
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