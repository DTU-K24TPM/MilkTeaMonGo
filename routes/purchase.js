var express = require('express')
var router = express.Router();

var Bill = require('../models/bill');
var User = require('../models/user');

function reverseArray(a) {
    var b =[];
    for (var i=a.length-1;i>=0;i--){
        b.push(a[i]);
    }
    return b;
}
router.get('/',function(req,res){
    User.findOne({email: req.session.user},function(err,us){
        Bill.find({email: req.session.user},function(err,b){
            if (err) return console.log(err);
            var newBill= reverseArray(b);
            res.render('purchase/purchaseShow',{
                us: us,
                bills: newBill
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

router.post('/complete',function(req,res){
    var id= req.body.userId;
    var phone =req.body.phone;
    var city = req.body.city;
    var district = req.body.district;
    var commune = req.body.commune;
    var address_detail = req.body.address_detail;
    var note = req.body.note;
    
})


module.exports = router;