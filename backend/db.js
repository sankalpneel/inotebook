const mongoose = require('mongoose');
const mongooseURI = "mongodb+srv://Sankalp:sankalp123@cluster0.i1h4v.mongodb.net/inotebook?retryWrites=true&w=majority";


const connectToMongo = () =>{
    mongoose.connect(mongooseURI, ()=>{
        console.log("Connection Success")
    })
}


module.exports = connectToMongo;