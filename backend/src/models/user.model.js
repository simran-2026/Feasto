const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    FullName: {
        type: String,
        required: true
    },
    Email: {        
        type: String,
        required: true,
        unique: true,   
    },
    password:{
        type: String,
    }
},
{ timestamps: true }
);

const usermodel = mongoose.model('User', userSchema);
module.exports = usermodel;
