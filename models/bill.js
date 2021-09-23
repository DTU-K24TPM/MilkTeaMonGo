var mongoose = require('mongoose')

var BillSchema = mongoose.Schema({
    email:{
        type: String,
        require:true
    },
    note:{
        type:String
    },
    address:{
        type:String
    },
    createAt: { type: Date, default: Date.now},
    dateVN: {type:String},
    type: {type: String},
    cart: {type: Array},
    totalPrice: {type: Number},
})

var Bill = module.exports = mongoose.model('bills',BillSchema);