const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req , res , next)=>{

    //check for authorisation

    const authorization = req.headers.authorization;

    if(!authorization)
        return res.status(401).json({error: "Token not found"});
    const token = req.headers.authorization.split(' ')[1];

    if(!token) return res.status(401).json({
        error : "Unauthorized"
    })

    try{
        //verify jwt token
        const decoded = jwt.verify(token , process.env.JWT_SECRET);

        req.user = decoded;
        next();
    }catch(err){

        console.error(err);
        res.status(401).json({error : "Invalid token"});
        
    }
}

//generate token function
const generateToken = (payload) =>{

    return jwt.sign(payload , process.env.JWT_SECRET);

}

module.exports =  {jwtAuthMiddleware , generateToken};