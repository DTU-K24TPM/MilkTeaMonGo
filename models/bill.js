var mongoose = require('mongoose')

var BillSchema = mongoose.Schema({
    email:{
        type: String,
        require:true
    },
    address:{
        type:String
    },
    note:{
        type:String
    },
    createAt: { type: Date, default: Date.now},
    type: {type: String},
    cart: {type: Array},
    totalPrice: {type: Number},
})

var Bill = module.exports = mongoose.model('bills',BillSchema);