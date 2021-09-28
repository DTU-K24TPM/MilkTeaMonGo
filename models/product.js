var mongoose = require('mongoose')

var ProductSchema = mongoose.Schema({
    title:{
        type : String,
        required : true
    },
    slug:{
        type: String
    },
    category:{
        type: String,
        required : true
    },
    price:{
        type: Number,
        required : true
    },
    image:{
        type: String
    },
    unit:{
        type:String
    },
    quantity:{
        type:Number,
    },
    note:{
        type:String
    },
})

var Product = module.exports = mongoose.model('Product',ProductSchema);