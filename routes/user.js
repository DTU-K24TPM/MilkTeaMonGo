var express = require('express')
var router = express.Router();

var mkdir = require('mkdirp');
var fs = require('fs');
var resizeImg = require('resize-img');
var cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'thi', 
    api_key: '415314185911635', 
    api_secret: 'rle4Hc_E1Oe8dGx099O5xb7rASY',
    secure: true
  });

var checkAdmin = require('../middleware/checkAdmin.middleware');
var User = require('../models/user');



router.get('/',function(req,res){
    User.findOne({email: req.session.user},function(err,us){
        if (err) return console.log(err);
        res.render('users/userShow',{
            us : us
        });
    })
   
})

router.get('/admin',checkAdmin,function(req,res){
    User.findOne({email: req.session.user},function(err,us){
        if (err) return console.log(err);
        res.render('admin/admin-userShow',{
            us : us
        });
    })
   
})

router.get('/change-info',function(req,res){
    var io=req.app.get('socketio')
    io.on('connection', (socket) =>{  
        socket.on('change-pass',data =>{
            var message
            User.findOne({email: req.session.user},function(err,us){
                if (err) return console.log(err);
                if (us.password != data.oldpass) {
                    message="Mật khẩu không chính xác."
                }
                else {
                    us.password=data.newpass;
                    us.save(function(err){
                        if (err) return console.log(err);                        
                    })
                    message="Thay đổi mật khẩu thành công."
                }
                io.emit('message',{ 
                    message: message
                })
            })
        })
    })
    User.findOne({email: req.session.user},function(err,us){
        if (err) return console.log(err);
        res.render('users/userChange',{
            us : us
        });
    })
})

router.get('/admin/change-info',checkAdmin,function(req,res){
    var io=req.app.get('socketio')
    io.on('connection', (socket) =>{  
        socket.on('change-pass',data =>{
            var message
            User.findOne({email: req.session.user},function(err,us){
                if (err) return console.log(err);
                if (us.password != data.oldpass) {
                    message="Mật khẩu không chính xác."
                }
                else {
                    us.password=data.newpass;
                    us.save(function(err){
                        if (err) return console.log(err);                        
                    })
                    message="Thay đổi mật khẩu thành công."
                }
                io.emit('message',{ 
                    message: message
                })
            })
        })
    })
    User.findOne({email: req.session.user},function(err,us){
        if (err) return console.log(err);
        res.render('admin/admin-userChange',{
            us : us
        });
    })
})

router.post('/change-info',function(req,res){
    var fullname =req.body.fullname;
    var gender = req.body.gender;
    var birthday = req.body.birthday;
    var phone = req.body.phone
    if (req.files != null) var imageFile=req.files.image;
    else imageFile="";
    var pimage = req.body.pimage;
    User.findOne({email: req.session.user},function(err,us){
        if (err) return console.log(err);
        us.fullname=fullname;
        us.gender=gender;
        us.birthday=birthday;
        us.phone=phone
        us.save();
        if (imageFile != ""){
            cloudinary.uploader.upload(imageFile.tempFilePath,{folder:"milktea/users/"+us.email},function(err,rs){
                if (err) throw err;
                us.photo=rs.url;
                us.photoDrop=rs.public_id;
                fs.unlink(imageFile.tempFilePath,function(err){
                    if (err) throw err;
                })
                us.save(function(err){
                    if (err) throw err;
                    res.redirect('back');
                });
            })
        } else {
            res.redirect('back');
        }
        if (pimage!=""){
            cloudinary.uploader.destroy(pimage,function(err,rs){
                if (err) throw err;
            })
        }
        
    })
})

router.post('/change-pass',function(req,res){
    var oldpass= req.body.oldpass;
    var newpass = req.body.newpass;
    User.findOne({email: req.session.user},function(err,us){
        if (err) return console.log(err);
        if (us.password != oldpass) {
            return;
        }
        else {
            us.password=newpass;
            us.save(function(err){
                if (err) return console.log(err);
                res.redirect('back');
            })
        }
    })
})

module.exports = router;