const mongoose = require('mongoose');

const mongo_url = process.env.DB_URI;
const dbName = process.env.DB_NAME;

const connectDb = async()=>{

    try {
        
        const connectionInstance  = await mongoose.connect(`${mongo_url}/${dbName}`);

        console.log("Database connection established!!");


        
    } catch (error) {
        
        console.error("Error while connection database : ", error);
    }
}

module.exports = connectDb;