var mongoose = require('mongoose')

var WardSchema = mongoose.Schema({
    wards:{
        type: Array
    },
    type:{
        type:String
    }
})

var Ward = module.exports = mongoose.model('wards',WardSchema);