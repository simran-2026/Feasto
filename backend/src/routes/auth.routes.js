const express = require('express');
const authController = require('../controller/auth.controller');
// 💡 IMPORTANT: Import the middleware needed to protect the route
const { authUserMiddleware } = require('../middlewares/auth.middleware');


const router = express.Router();

// 🚀 NEW ENDPOINT FOR FRONTEND SESSION CHECK
// This uses the middleware to confirm the cookie/token is valid
router.get('/check-status', authUserMiddleware, (req, res) => {
    // If authUserMiddleware succeeds, the user is logged in.
    // Send a 200 status back to the frontend.
    res.status(200).json({ 
        message: "Session is active",
        user: { id: req.user._id, email: req.user.email } 
    });
});


// user auth api
router.post('/user/register', authController.registerUser);
router.post('/user/login', authController.loginUser);
router.get('/user/logout', authController.logoutUser);


// food partner auth api
router.post('/foodpartner/register', authController.registerFoodPartner);
router.post('/foodpartner/login', authController.loginFoodPartner);
router.get('/foodpartner/logout', authController.logoutFoodPartner);



module.exports = router;