var express = require('express')
var router = express.Router();

var Bill = require('../models/bill');
var User = require('../models/user');


router.get('/',function(req,res){
    Bill.find(function(err,b){
        if (err) return console.log(err);
        var newDate=b.map(function(rs){
            return rs.createAt.getDate()+'/'+(rs.createAt.getMonth()+1)+'/'+rs.createAt.getFullYear()+' '+
            rs.createAt.getHours()+':'+rs.createAt.getMinutes()+':'+rs.createAt.getSeconds();
        })
        res.render('admin/admin-purchase',{
            bills: b,
            newDate: newDate
        })
    })
})

router.get('/search',function(req,res){
    var s = req.query.search;
    Bill.find(function(err,b){
        if (err) return console.log(err);
        var newBill = b.filter(function(result){
            return (result.idb.toLowerCase().indexOf(s.toLowerCase()) != -1) || (result.email.indexOf(s.toLowerCase()) != -1);
        })
        var newDate=newBill.map(function(rs){
            return rs.createAt.getDate()+'/'+(rs.createAt.getMonth()+1)+'/'+rs.createAt.getFullYear()+' '+
            rs.createAt.getHours()+':'+rs.createAt.getMinutes()+':'+rs.createAt.getSeconds();
        })
        res.render('admin/admin-purchase',{
            bills: newBill,
            newDate: newDate
        })
    })
    
})

router.get('/:type',function(req,res){
    var type = req.params.type;
    Bill.find({type: type},function(err,b){
        if (err) return console.log(err);
        var newDate=b.map(function(rs){
            return rs.createAt.getDate()+'/'+(rs.createAt.getMonth()+1)+'/'+rs.createAt.getFullYear()+' '+
            rs.createAt.getHours()+':'+rs.createAt.getMinutes()+':'+rs.createAt.getSeconds();
        })
        res.render('admin/admin-purchase',{
            bills: b,
            newDate: newDate
        })
    })
})

router.post('/change-type',function(req,res){
    var value = req.body.value;
    var id= req.body.id;
    Bill.findOne({_id: id},function(err,b){
        if (err) return console.log(err);
        b.type=value;
        b.save(function(err){
            if (err) return console.log(err);
        })
        res.send({text: "success"})
    })
})

router.post('/search-time',function(req,res){
    var datefrom = req.body.datefrom;
    var dateto= req.body.dateto;
    if (new Date(req.body.datefrom)>new Date(req.body.dateto)) {
        Bill.find(function(err,b){
        res.render('admin/admin-purchase',{
            datefrom: datefrom.toString(),
            dateto:dateto.toString(),
            mes: "Ngày bắt đầu phải nhỏ hơn ngày kết thúc",
            bills: [],
            })
        })
    }
    else {
    Bill.find({createAt:{$gte:new Date(req.body.datefrom),$lt:new Date(req.body.dateto)}},function(err,b){
        if (err) return console.log(err);
        var newDate=b.map(function(rs){
            return rs.createAt.getDate()+'/'+(rs.createAt.getMonth()+1)+'/'+rs.createAt.getFullYear()+' '+
            rs.createAt.getHours()+':'+rs.createAt.getMinutes()+':'+rs.createAt.getSeconds();
        })
        res.render('admin/admin-purchase',{
            datefrom: datefrom,
            dateto:dateto,
            bills: b,
            newDate:newDate
        })
    })
    }
})
router.get('/delete/:id',function(req,res){
    var id = req.params.id;
    Bill.findByIdAndRemove(id,function(err){
        if (err) return console.log(err);
        res.redirect('back');
    })
})

router.post('/cancelConfirm',function(req,res){
    var id = req.body.id;
    Bill.findById(id,function(err,b){
        if (err) return console.log(err);
         var htmlCode = `<option value="wait-confirm" `;
          if (b.type=="wait-confirm") htmlCode=htmlCode+` selected="selected" `;
          htmlCode=htmlCode+ `>Chờ xác nhận</option> <option value="wait-rev" `;
          if (b.type=="wait-rev") htmlCode=htmlCode+` selected="selected" `;
         htmlCode=htmlCode+ ` >Chờ lấy hàng </option> <option value="delivering" `;
         if (b.type=="delivering") htmlCode=htmlCode+` selected="selected" `;
         htmlCode=htmlCode+ ` >Đang giao</option> <option value="delivered" `;
         if (b.type=="delivered") htmlCode=htmlCode+` selected="selected" `;
         htmlCode=htmlCode+ ` >Đã giao</option> <option value="cancelled" `;
         if (b.type=="cancelled") htmlCode=htmlCode+` selected="selected" `;
         htmlCode=htmlCode+ `>Đã hủy</option>`;
        res.send({code : htmlCode})
    })
})




module.exports = router;