var express = require('express')
var router = express.Router();

var User= require('../models/user');


//get register
router.get('/register',function(req,res){
    res.render('auth/register',{
        mes:""
    });
})

//post register
router.post('/register',function(req,res){
    var email= req.body.email;
    var password= req.body.password;
    var fullname= req.body.fullname;
    var gender = parseInt(req.body.gender);
    var birthday = req.body.birthday;
    var phone = req.body.phone;
    User.findOne({email: email},function(err,user){
        if(err) return console.log(err);
        if (user) {
            res.render('auth/register',{
                mes: 'Email đã tồn tại'
            })
        }
        else{
            var user=new User({
                email:email,
                password:password,
                fullname:fullname,
                gender:gender,
                birthday:birthday,
                phone: phone,
                admin:0
            });
            user.save(function(err){
                if (err) return console.log(err);
                res.render('auth/register',{
                    mes:'Đăng ký thành công'
                })
            })
           
        }
    })

})

//get login
router.get('/login',function(req,res){
    res.render('auth/login',{
        value: "",
        mes : ""
    });
})

//post login
router.post('/login',function(req,res){
    var email= req.body.email;
    var password = req.body.password;
    User.findOne({email: email},function(err,user){
        if (err) return console.log(err);
        if (user){
            if (user.password== password){
                req.session.user = email;
                res.redirect('/');
            }
            else {
                res.render('auth/login',{
                    value: email,
                    mes: 'Sai mật khẩu'
                })
            }
        }
        else {
            res.render('auth/login',{
                value:email,
                mes: 'Tài khoản không tôn tại'
            })
        }
    })
   
})

//get logout
router.get('/logout',function(req,res){
    req.session.destroy();
    res.redirect('/');
})



module.exports = router;