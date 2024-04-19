const { name } = require("ejs");
const express = require("express");
const app = express();
const port = 3200;
const collection=require("./mongodb")
const nodemailer = require('nodemailer');



app.set("view engine", "ejs");


app.use(express.static("public"));
app.use(express.urlencoded({extended:true}))

 
app.get("/home", (req, res) => {
  res.render("home.ejs");
});

app.get("/aboutUs", (req, res) => {
  res.render("aboutUs.ejs");
});

app.get("/menu", (req, res) => {
  res.render("menu.ejs");
});

app.get("/", (req, res) => {
  res.render("loginform.ejs");
});

app.get("/register", (req, res) => {
  res.render("registerform.ejs");
});

app.post("/r", async (req,res) => {
  
  const data={
    name: req.body.name,
    password: req.body.password, 
    email: req.body.email
  }

  await collection.insertMany([data])

  res.redirect("/home")
})

app.post("/l", async (req,res) => {
  
  try{
    const check=await collection.findOne({email:req.body.email})

    if(check.password===req.body.password){
      res.redirect("/home")
    }
    else{
      res.send("wrong password")
    }

  }
  catch{
    res.send("Data Salah")
  }
})

app.post("/contactUs", function(req, res){
  const output = `
  <h3> Informasi </h3
  <ul>
      <li>Nama: ${req.body.namaPengirim}</li>
      <li>Email: ${req.body.emailPengirim}</li>
  </ul>
  <h3>Pesan</h3>
  <p>${req.body.pesanPengirim}</p>`

var transpoter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'muhammad.535220221@stu.untar.ac.id',
    pass: 'sbfr uaic msxe vnah'
  }
})

var mailOptions = {
  to: 'muhammad.535220221@stu.untar.ac.id',
  subject: 'Pesan baru',
  html: output
};

transpoter.sendMail(mailOptions, function(error, info){
  if(error){
    console.log(error);
  }
  else{
    res.redirect('/home');
    console.log("email sent" + info.response);
  }
})
})

app.listen(port, () => {
  console.log(`server berjalan ${port}`);
});
