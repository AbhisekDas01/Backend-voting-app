const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidate.model');
const {jwtAuthMiddleware } = require('../jwt');
const User = require('../models/user.model');


const checkAdminRole = async (userId) =>{
    try {
        
        const user = await User.findById(userId);

        console.log(user);
        
        return user.role === 'admin';
    } catch (error) {
        return false;
    }
}

//to add a candidate
router.post('/' , jwtAuthMiddleware,async(req , res)=>{

    try {

        

        if(!(await checkAdminRole(req.user.id))){
            return res.status(403).json({
                success: false,
                message: "Only admin can change data"
            })
        }
        
        const data = req.body;

        const newCandidate = new Candidate(data);

        const response = await newCandidate.save();

        console.log("data saved for candidate!!");

        res.status(200).json({
            success: true,
            response: response
        });
        

    } catch (error) {
        
        console.log("error while signing Up!!" , error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
        
    }
});



router.put('/:candidateId' , jwtAuthMiddleware, async (req , res)=>{
    try {

        if(!checkAdminRole(req.user.id)){
            return res.status(403).json({
                success: false,
                message: "Only admin can change data"
            })
        }
        
        const candidateId = req.params.candidateId;

        const updatedData = req.body;

        const response = await Candidate.findByIdAndUpdate(candidateId , updatedData ,{
            new: true,
            runValidators: true
        });

        if(!response) {
            return res.status(404).json({
                success: false,
                message: "Unable to fetch candidate data!"
            })
        }

        console.log("Candidate data updated!!");
        res.status(200).json(response);
        
        
    } catch (error) {
        
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
        
    }
});



router.delete('/:candidateId' , jwtAuthMiddleware, async (req , res)=>{
    try {

        if(!checkAdminRole(req.user.id)){
            return res.status(403).json({
                success: false,
                message: "Only admin can change data"
            })
        }
        
        const candidateId = req.params.candidateId;


        const response = await Candidate.findByIdAndDelete(candidateId);

        if(!response) {
            return res.status(404).json({
                success: false,
                message: "Unable to fetch candidate data!"
            })
        }

        console.log("Candidate data updated!!");
        res.status(200).json({
            success: true,
            message:"Candidate deleted Successfully"
        });
        
        
    } catch (error) {
        
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
        
    }
});

//voting route
router.post('/vote/:candidateId' , jwtAuthMiddleware , async (req , res)=>{

    candidateId = req.params.candidateId;
    userId = req.user.id;

    try {
        
        const candidate = await Candidate.findById(candidateId);

        if(!candidate){
            return res.status(404).json({
                success: false,
                message: "Candidate not found!!"
            });
        }

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                success: false,
                message: "user not found!!"
            });
        }

        //if user already voted
        if(user.isVoted){
            return res.status(400).json({
                success: false,
                message:  "User already voted!!" 
            })
        }

        if(user.role === 'admin'){
            return res.status(403).json({
                success: false,
                message: "Admin is not allowed to vote"
            })
        }

        //update candidate array
        candidate.votes.push({user: userId});
        candidate.voteCount++;
        await candidate.save();

        //update the user doc
        user.isVoted = true;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Voted successfully"
        })

    } catch (error) {
        console.log("Error while voting : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
        
    }

});


//vote count 
router.get('/vote/count' , async (req , res)=>{
    try {
        
        const candidate = await Candidate.find().sort({voteCount: 'desc'});

        const record = candidate.map((data)=>{
            return {
                party: data.party,
                count: data.voteCount
            }
        });

        return res.status(200).json(record);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
})

//find list of candites 
router.get('/candidate' , async (req , res)=>{
    try {
        const response = await Candidate.find();

        res.status(200).json(response);
    } catch (error) {
        
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error while fetching data"
        })
        
    }
});

module.exports = router;
