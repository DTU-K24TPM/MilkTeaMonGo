var express = require('express')
var router = express.Router();

router.get('/',function(req,res){
    res.render('admin/admin-statistic')
})

router.post('/',(req,res) =>{    
    var year = req.body.getmonth.slice(0,4)
    var month = req.body.getmonth.slice(5,7)
    res.send(year+"--------"+month)
})

module.exports = router;