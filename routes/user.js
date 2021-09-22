var express = require('express')
var router = express.Router();

var mkdir = require('mkdirp');
var fs = require('fs-extra');
var resizeImg = require('resize-img')

var User = require('../models/user');



router.get('/',function(req,res){
    User.findOne({email: req.session.user},function(err,us){
        if (err) return console.log(err);
        res.render('users/userShow',{
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

router.post('/change-info',function(req,res){
    var fullname =req.body.fullname;
    var gender = req.body.gender;
    var birthday = req.body.birthday;
    var imageFile =  (req.files != null)? req.files.image.name:""; 
    var pimage = req.body.pimage;
    User.findOne({email: req.session.user},function(err,us){
        if (err) return console.log(err);
        us.fullname=fullname;
        us.gender=gender;
        us.birthday=birthday;
        if (imageFile != ""){
            us.photo= imageFile;
        }
        us.save(function(err){
            if (err)
                console.log(err);
            if (imageFile != ""){
                if (pimage != "" && pimage != imageFile){
                    fs.remove('public/img/users/'+us.email +'/'+ pimage,function(err){
                        if (err) console.log(err);
                     });
                }

                var UserImage =req.files.image;
                var path= 'public/img/users/'+ us.email +'/' + imageFile;

                UserImage.mv(path,function(err){
                    if (err)return console.log(err)
                });
                }
                res.redirect('/user')
        })
    })
})

router.post('/change-pass',function(req,res){
    var oldpass= req.body.oldpass;
    var newpass = req.body.newpass;
    User.findOne({email: req.session.user},function(err,us){
        if (err) return console.log(err);
        if (us.password != oldpass) {
            res.redirect('/');
            return;
        }
        else {
            us.password=newpass;
            us.save(function(err){
                if (err) return console.log(err);
                res.redirect('/user');
            })
        }
    })
})

module.exports = router;