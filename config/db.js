const mongoose = require("mongoose")

//Connects to the MongoDB database using the URI from environment variables.
const connectDB = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Connected to: ${conn.connection.host}`)
    }catch(err){
        console.log(`Error: ${err.message}`)
    }
}

module.exports = {
    connectDB
}