const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/WebNgopiLur").then(() => {
    console.log("mongodb connected");
})
.catch(() => {
    console.log("failed to connect");
})

// Mendefinisikan skema untuk koleksi data pengguna
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
    },
    token:{
        type:String,
        required:true
    }
})

// Membuat model berdasarkan skema untuk koleksi "DataPengguna"
const Collection=new mongoose.model("DataPengguna", Form)
// Mengekspor model untuk digunakan di tempat lain dalam aplikasi
module.exports=Collection