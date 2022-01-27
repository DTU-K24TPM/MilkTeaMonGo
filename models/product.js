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
        type: String,
        default:""
    },
    imageDrop:{
        type:String,
        default:""
    },
    block:{
        type: Number,
        default: 1,
    },
    quantity:{
        type:Number,
    },
})

var Product = module.exports = mongoose.model('Product',ProductSchema);