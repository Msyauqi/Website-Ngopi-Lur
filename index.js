const express = require("express");
const app = express();
const port = 3200;
const Collection=require("./mongodb")
const nodemailer = require('nodemailer');
const jwt=require("jsonwebtoken")
const cookieParser=require("cookie-parser")
const bcryptjs=require("bcryptjs")



async function hashPass(password){
  const res=await bcryptjs.hash(password,10)
  return res
}

async function compare(userPass, hashPass){
  const res=await bcryptjs.compare(userPass, hashPass)
  return res
}

app.set("view engine", "ejs");


app.use(express.static("public"));
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))

 
app.get("/", (req, res) => {
  if(req.cookies.jwt){
    const verify=jwt.verify(req.cookies.jwt, "helloawdiotpsyhrntkcmanwudhioptmeka")
    res.redirect("/home")
  }

  else{
    res.redirect("/login")
  }
})
app.get("/home", (req, res) => {
  res.render("home.ejs");
});

app.get("/aboutUs", (req, res) => {
  res.render("aboutUs.ejs");
});

app.get("/menu", (req, res) => {
  res.render("menu.ejs");
});

app.get("/login", (req, res) => {
  res.render("loginform.ejs");
});

app.get("/register", (req, res) => {
  res.render("registerform.ejs");
});

app.get("/contactUs", (req, res) => {
  res.render("contactUs.ejs");
});

app.get("/events", (req, res) => {
  res.render("event.ejs");
});

app.post("/r", async(req, res) => {
  try {
    const check = await Collection.findOne({name:req.body.name})
  
        if(check){
          res.send("user telah digunakan")
        }

        else{
          const token=jwt.sign({name:req.body.name}, "helloawdiotpsyhrntkcmanwudhioptmeka")
          
          res.cookie("jwt", token, {
            maxAge:600000,
            httpOnly:true
          })

          const data={
            name:req.body.name,
            email:req.body.email,
            password: await hashPass(req.body.password),
            token:token
          }

          await Collection.insertMany([data])
          res.redirect("/home");
        }
  }
  catch (error) {
    console.error(error); // Tampilkan kesalahan di konsol
    res.send("ada kesalahan: " + error.message);
  }
})

app.post("/l", async(req, res) => {
  try {
    const check = await Collection.findOne({name:req.body.name})
    const passCheck=await compare(req.body.password,check.password)
        
      if(check && passCheck){

        res.cookie("jwt", check.token, {
          maxAge:600000,
          httpOnly:true
        })

          res.redirect("/home");
        }

        else{
          res.send("terdapat kesalahan")
        }
  }
  catch (error) {
    console.error(error); // Tampilkan kesalahan di konsol
    res.send("ada kesalahan: " + error.message);
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
    res.redirect('/contactUs');
    console.log("email sent" + info.response);
  }
})
})

app.listen(port, () => {
  console.log(`server berjalan ${port}`);
});
