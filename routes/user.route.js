const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const {jwtAuthMiddleware , generateToken } = require('../jwt');

//signup router 
router.post('/signup' , async(req , res)=>{

    try {
        

        const data = req.body;

        if(data.role === 'admin'){
            const findRole = await User.findOne({role: 'admin'});

            if(findRole){
                return res.status(403).json({
                    success: true,
                    message: "only one admin is allowed!!"
                })
            }
        }
        const newUser = new User(data);

        const response = await newUser.save();

        console.log("data saved for user!!");

        //after saving the data generate token and send to the user
        const payload = {
            id: response.id
        }

        const token = generateToken(payload);

        console.log("Token generated!! : ",token );

        res.status(200).json({
            success: true,
            response: response,
            token: token
        });
        

    } catch (error) {
        
        console.log("error while signing Up!!" , error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
        
    }
});

//login router
router.post('/login' , async(req , res)=>{

    try {
            //extract the details 
        const {adharCardNumber , password} = req.body;

        //find the user from db
        const user = await User.findOne({adharCardNumber: adharCardNumber});

        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({
                success: false,
                message: "Invalid username or Password!"
            });
        }

        // generateToken
        const payload = {
            id: user.id
        };
        const token = generateToken(payload);

        res.json({
            message: "Login success",
            Token: token});

    } catch (error) {
        console.error("Error while logining" , error);
        res.status(500).json({
            success: false,
            message: "Internal server error "
        })
    }
});

//profile router (first decode the token)
router.get('/profile' , jwtAuthMiddleware,  async (req , res) =>{
    try {
        
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);
        res.status(200).json(user);
    } catch (error) {
        console.log("Error while accessing profile ; ",error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch profile details"
        })
        
    }
});

router.put('/profile/password' ,jwtAuthMiddleware ,  async (req , res)=>{
    try {
        const userId = req.user.id;
        const {currentPassword , newPassword} = req.body;

        const user = await User.findById(userId);

        if(!(await user.comparePassword(currentPassword))){
            res.status(401).json({
                success: false,
                message: "Invalid current password!"
            });
        }

        //update the user password
        user.password = newPassword;
        await user.save();


        console.log("Password updated!");

        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        })
        
        
    } catch (error) {
        
        console.log(error);
        res.status(500).json({
            message: "Error while updating password"
        })
        
    }
});

module.exports = router;