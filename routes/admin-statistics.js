var express = require('express')
var router = express.Router();

var Bill = require('../models/bill')

function daysInMonth(month, year){
    return new Date(year,month,0).getDate();
}

router.get('/',function(req,res){
    var date = new Date()
    var month = date.getMonth()+1
    var year = date.getFullYear()
    var days = daysInMonth(month,year)
    var datamonth = new Array(days)
    var datayear = new Array(12)
    var newbill1 = []
    var newbill2 = []
    Bill.find({}, function(err,bills){
        bills.forEach(bill => {            
            if((bill.createAt.getMonth()+1)==month && (bill.createAt.getFullYear())==year) newbill1.push(bill)
        });
        for(let i=0;i<datamonth.length;i++){
            datamonth[i]=0
            newbill1.forEach(bill => {
                if((bill.createAt.getDate()-1)==i){
                    datamonth[i]+=bill.totalPrice
                }
            })
        }        
        bills.forEach(bill1 => {
            if( (bill1.createAt.getFullYear())==year) newbill2.push(bill1)
        });
        for(let i=0;i<datayear.length;i++){
            datayear[i]=0
            newbill2.forEach(bill => {
                if((bill.createAt.getMonth())==i){
                    datayear[i]+=bill.totalPrice
                }
            })
        }
        res.render('admin/admin-statistic',{
            datamonth:datamonth,
            datayear:datayear,
            month:month,
            year:year
        })
    })    
})

router.post('/month',(req,res) =>{
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

router.post('/year',(req,res) =>{
    var year = req.body.getyear
    var months = []
    for(let i=0;i<=11;i++){
        months.push(i)
    }    
    var newbill = []
    var data = new Array(months.length)
    Bill.find({}, function(err,bills){
        bills.forEach(bill => {
            if( (bill.createAt.getFullYear())==year) newbill.push(bill)
        });
        for(let i=0;i<data.length;i++){
            data[i]=0
            newbill.forEach(bill => {
                if((bill.createAt.getMonth())==i){
                    data[i]+=bill.totalPrice
                }
            })
        }        
        res.send({
            data: data,            
            year: year
        })
    })    
})

module.exports = router;