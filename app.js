const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const path=require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

mongoose.connect(process.env.DatabaseUrl)
.then(()=>console.log('connected to db'))
.catch((err)=>{console.log(err)});
app.use(bodyParser.json());

// express.static -> allows access and proceeds for the url with /images
app.use("/images", express.static(path.join(__dirname, 'images'))); // path.join to map exact path

app.use((req, res, next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, DELETE, PUT, OPTIONS");
    next();
});

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

module.exports = app;