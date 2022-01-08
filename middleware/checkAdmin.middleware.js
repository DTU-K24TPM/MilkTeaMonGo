var User= require('../models/user');

module.exports = function(req,res,next){
    if (req.session.admin==0){
        res.render('error',{
            mes:'Bạn không có quyền truy cập'
        });
        return;
    }
    else next();
}