var mongoose = require('mongoose')

var BillSchema = mongoose.Schema({
    idb:{
        type: String,
        require:true
    },
    email:{
        type: String,
        require:true
    },
    name:{
        type:String
    },
    note:{
        type:String
    },
    address:{
        type:String
    },
    phone:{type:String},
    createAt: { type: Date, default: Date.now},
    dateVN: {type:String},
    type: {type: String},
    cart: {type: Array},
    totalPrice: {type: Number},
})

var Bill = module.exports = mongoose.model('bills',BillSchema);