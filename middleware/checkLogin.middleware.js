var User= require('../models/user');

module.exports = function(req,res,next){
    if (!req.session.user){
        res.redirect('/auth/login');
        return;
    }
    var user = req.session.user;
    User.findOne({email : user},function(err,us){
        if (err) return console.log(err);
        if (us){
            next();
        }
        else {
            res.redirect('/auth/login');
        }
    })
}