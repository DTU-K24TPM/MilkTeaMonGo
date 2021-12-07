var express = require('express')
var router = express.Router();

var Bill = require('../models/bill')

function daysInMonth(month, year){
    return new Date(year,month,0).getDate();
}

router.get('/',function(req,res){
    var date = new Date()
    res.render('admin/admin-statistic',{
        data:"",
        month:date.getMonth()+1,
        year:date.getFullYear()
    })
})

router.post('/',(req,res) =>{
    var year = req.body.getmonth.slice(0,4)
    var month = req.body.getmonth.slice(5,7)
    var days = daysInMonth(month,year)
    var newbill = []
    var data = new Array(days)
    Bill.find({}, function(err,bills){
        bills.forEach(bill => {            
            if((bill.createAt.getMonth()+1)==month && (bill.createAt.getFullYear())==year) newbill.push(bill)
        });
        for(let i=0;i<data.length;i++){
            data[i]=0
            newbill.forEach(bill => {
                if((bill.createAt.getDate()-1)==i){
                    data[i]+=bill.totalPrice
                }
            })
        }        
        res.send({
            data: data,
            month: month,
            year: year
        })
    })    
})

module.exports = router;