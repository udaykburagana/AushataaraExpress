require('dotenv').config()
const express = require("express");
const app = express();

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL);

mongoose.connection.on('error', err => {
    console.log(err);
  });

mongoose.connection.on("connected", () => {
    console.log("connected to DB");
});

const cors = require("cors");
app.use(cors());

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use("/",require("./routes"))

app.listen(process.env.PORT,()=>{
    console.log(`running Aushadam on ${process.env.PORT}`)
})