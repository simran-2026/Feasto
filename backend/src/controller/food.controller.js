const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const {v4 : uuid} = require("uuid");



async function createFood(req, res) {
  try {
   

   
    const fileUploadResult = await storageService.uploadFile(req.file.buffer,uuid())
     console.log("File upload result:", fileUploadResult);


     const foodItem = await foodModel.create({
      name: req.body.name,
      description: req.body.description,
      video: fileUploadResult.url,
      foodPartner: req.foodPartner._id
     });

    
    res.status(201).json({
     message: "✅ Food Item Created Successfully",
     food:foodItem
    });


  } catch (error) {
    console.error("❌ Error in createFood:", error);
    res.status(500).json({ message: "Server error while creating food" });
  }
}

async function getFoodItems (req,res){
  const  foodItem = await foodModel.find({})
  res.status(200).json({
    message:"food item fetch successfully",
    foodItem
  })
}





module.exports = {
  createFood,
  getFoodItems
};
