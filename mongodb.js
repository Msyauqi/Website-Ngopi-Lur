const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/WebNgopiLur").then(() => {
    console.log("mongodb connected");
})
.catch(() => {
    console.log("failed to connect");
})

const Form = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }
})

const collection=new mongoose.model("DataPengguna", Form)

module.exports=collection