var mongoose = require('mongoose')

var CommuneSchema = mongoose.Schema({
    communes:{
        type: Array
    },
    type:{
        type:String
    }
})

var Commune = module.exports = mongoose.model('communes',CommuneSchema);