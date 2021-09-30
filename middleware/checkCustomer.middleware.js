var User= require('../models/user');

module.exports = function(req,res,next){
    if (req.session.admin==1){
        res.render('error');
        return;
    }
    else next();
}