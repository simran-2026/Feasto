
const foodPartnerModel = require('../models/foodpartner.model');
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');


async function authFoodPartnerMiddleware(req, res, next) {
  const token = req.cookies.token;
  console.log("🍪 Token from cookies:", token);

  if (!token) {
    return res.status(401).json({ message: "Please Login First" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🧩 Decoded token payload:", decoded);

    const foodPartner = await foodPartnerModel.findById(decoded.id);
    console.log("👤 DB Query Result (foodPartner):", foodPartner);

    if (!foodPartner) {
      console.log("⚠️ No food partner found for ID:", decoded.id);
      return res.status(401).json({ message: "Invalid token or user not found" });
    }

    req.foodPartner = foodPartner;
    next();
  } catch (err) {
    console.log("❌ JWT Verify Error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
}


async function authUserMiddleware(req, res, next) {
  const token = req.cookies.token;
  if(!token){
    return res.status(401).json({message:"Please Login First"});
  }

 try{
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    req.user = user;
    next();
 }catch(err){
  return res.status(401).json({message:"Invalid token"});
 }





}



module.exports={
    authFoodPartnerMiddleware,
    authUserMiddleware
} 


