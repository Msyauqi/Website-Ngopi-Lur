const express = require("express");
const app = express();
const port = 3200;
const Collection=require("./mongodb")
const nodemailer = require('nodemailer');
const jwt=require("jsonwebtoken")
const cookieParser=require("cookie-parser")
const bcryptjs=require("bcryptjs")
const handlePlaceOrder = require("./midtrans/placeOrder");

//untuk menghas password
async function hashPass(password){
  const res=await bcryptjs.hash(password,10)
  return res
}

// Fungsi untuk membandingkan password yang di-hash dengan password yang diberikan oleh pengguna
async function compare(userPass, hashPass){
  const res=await bcryptjs.compare(userPass, hashPass)
  return res
}

app.set("view engine", "ejs");


app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}))

// Endpoint untuk menangani permintaan pembuatan pesanan
app.post("/placeOrder", handlePlaceOrder);

// Endpoint untuk halaman beranda
app.get("/", (req, res) => {
   // Memeriksa apakah pengguna telah login menggunakan token JWT yang disimpan di cookie
  if(req.cookies.jwt){
    // Memverifikasi token JWT
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

// Endpoint untuk memproses registrasi pengguna baru
app.post("/r", async(req, res) => {
  try {
    // Memeriksa apakah nama pengguna sudah digunakan sebelumnya
    const check = await Collection.findOne({name:req.body.name})
  
        if(check){
          res.send("user telah digunakan")
        }

        else{
          // Jika nama pengguna belum penah digunakan(user baru), maka membuat token JWT
          const token=jwt.sign({name:req.body.name}, "helloawdiotpsyhrntkcmanwudhioptmeka")
          
          // Menyimpan token JWT dalam cookie
          res.cookie("jwt", token, {
            maxAge:600000,
            httpOnly:true
          })

          // Membuat objek data pengguna baru
          const data={
            name:req.body.name,
            email:req.body.email,
            password: await hashPass(req.body.password),
            token:token
          }
          
          // Menyimpan data pengguna baru ke dalam database
          await Collection.insertMany([data])
          res.redirect("/home");
        }
  }
  catch (error) {
    console.error(error); // Tampilkan kesalahan di konsol
    res.send("ada kesalahan: " + error.message);
  }
})

// Endpoint untuk memproses login pengguna
app.post("/l", async(req, res) => {
  try {
    // Memeriksa apakah pengguna terdaftar dalam database
    const check = await Collection.findOne({name:req.body.name})
    // Memeriksa apakah password yang dimasukkan oleh pengguna cocok dengan password yang tersimpan dalam database
    const passCheck=await compare(req.body.password,check.password)
        
      if(check && passCheck){
        // Jika pengguna terdaftar dan password cocok, membuat cookie JWT
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

// Endpoint untuk memproses pengiriman pesan dari halaman kontak
app.post("/contactUs", function(req, res){
  // Membuat output email dengan informasi yang diberikan oleh pengguna
  const output = `
  <h3> Informasi </h3
  <ul>
      <li>Nama: ${req.body.namaPengirim}</li>
      <li>Email: ${req.body.emailPengirim}</li>
  </ul>
  <h3>Pesan</h3>
  <p>${req.body.pesanPengirim}</p>`

// Konfigurasi transporter untuk pengiriman email
var transpoter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'muhammad.535220221@stu.untar.ac.id',
    pass: 'sbfr uaic msxe vnah'
  }
})

// Konfigurasi transporter untuk pengiriman email
var mailOptions = {
  to: 'muhammad.535220221@stu.untar.ac.id',
  subject: 'Pesan baru',
  html: output
};
// Mengirim email menggunakan transporter yang telah dikonfigurasi sebelumnya
transpoter.sendMail(mailOptions, function(error, info){
  // Callback untuk menangani respons dari pengiriman email
  if(error){
    console.log(error);
  }
  else{
    res.redirect('/contactUs');
    console.log("email sent" + info.response);
  }
});
}); // Penutup dari penanganan endpoint "/contactUs"

app.listen(port, () => {
  console.log(`server berjalan ${port}`);
});
