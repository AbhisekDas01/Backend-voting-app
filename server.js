require('dotenv').config()

const connectDb = require('./Database/dbConnection');
const express  =require('express');
const app = express();



const bodyParser = require('body-parser');
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

//connect db
connectDb(); 

app.get('/' , (req , res) =>{

    res.send("Welcome to voter app");
})

//user route
const userRoutes = require('./routes/user.route');
const candidateRoutes = require('./routes/candidate.route');

app.use('/candidate' ,candidateRoutes);
app.use('/user' , userRoutes);

app.listen(port , ()=>{

    console.log(`Server started!! -> http://localhost:${port}/`);
    
})