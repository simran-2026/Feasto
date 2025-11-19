const mongoose = require('mongoose');

const foodPartnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contactName:{
   type: String,
    required: true
    },
    phone:{
        type: String,
        required: true  
    },
    address:{

    },
    email: {        
        type: String,
        required: true,
        unique: true,   
    },
    password:{
        type: String,
        required: true
    },
})




const  foodpartnermodel = mongoose.model('FoodPartner', foodPartnerSchema);
module.exports = foodpartnermodel;