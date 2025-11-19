const express = require('express');
const router = express.Router();
const multer = require('multer');

const foodController = require('../controller/food.controller');
 const authMiddleware = require('../middlewares/auth.middleware');
// const { authFoodPartnerMiddleware } = require('../middlewares/auth.middleware');




const upload = multer({  
  storage: multer.memoryStorage(),
});

// ✅ IMPORTANT: middleware comes BEFORE upload.single()
router.post('/', 
  authMiddleware.authFoodPartnerMiddleware, 
  upload.single('video'),
   foodController.createFood);

//get the food item video while scroolling 

router.get('/',authMiddleware.authUserMiddleware, foodController.getFoodItems);


router.post('/like', 
  authMiddleware.authUserMiddleware,foodController.likeFood)

router.post('/save',authMiddleware.authUserMiddleware, foodController.saveFood);


router.get('/save',authMiddleware.authUserMiddleware, foodController.getSaveFood);  

module.exports = router;
