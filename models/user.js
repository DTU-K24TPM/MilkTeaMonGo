var mongoose = require('mongoose')

var UserSchema = mongoose.Schema({
    email:{
        type : String,
        required : true
    },
    password:{
        type: String
    },
    fullname:{
        type: String,
        required : true
    },
    birthday:{
        type: String,
        required : true
    },
    admin:{
        type: Number,
    },
    gender:{
        type: Number
    },
    cart:{
        type: Array
    },
    phone:{
        type:String
    },
    photo:{
        type:String
    }
})

var User = module.exports = mongoose.model('User',UserSchema);