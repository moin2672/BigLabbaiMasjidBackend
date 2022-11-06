const express = require('express');
const mogoose = require("mongoose");


const userRoutes = require("./routes/users");
const memberRoutes = require("./routes/members");
const streetRoutes = require("./routes/streets");

const app = express();

mogoose.connect("mongodb+srv://biglabbaimasjid:"+process.env.MONGO_ALTAS_PW+"@cluster0.uim7hqw.mongodb.net/membershipdb", { useNewUrlParser: true, useUnifiedTopology: true })
        .then(()=>{console.log("Connected to Database")})
        .catch(()=>{console.log("Db connection failed!")});

app.use(express.json());
app.use(express.urlencoded({extended: false}));

//middleware
//Adding middleware to resolve CORS problem
app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next()
});


app.use("/api/users",userRoutes);
app.use("/api/members",memberRoutes);
app.use("/api/streets",streetRoutes);

app.use((req, res, next)=>{
    res.send('Hello From Express')
});

module.exports = app;