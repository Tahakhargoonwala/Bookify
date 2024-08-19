require('dotenv').config();
const express = require("express");
const app=express();
const mongoose = require('mongoose');
const port = 3000;
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync")  //for async eroor hadling no need touse try and catch
const expressError = require("./utils/expressError");
const {listingSchema,reviewSchema} = require("./schema.js")
const Review = require("./models/review");
const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User=require("./models/user.js")





app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


app.listen(3000,()=>{
    console.log(`app is listening at port ${port}`);
})

const dbUrl=process.env.ATLASDb;

main()
    .then(()=>console.log("connected to DB 1"))
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);}


const store= MongoStore.create({
    mongoUrl : dbUrl,
    crypto:{
        secret:"mySuperSecretCode"
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("Error! in MONGO SESSION STORE",err)
})


const sessionOptions = {
    store,
    secret:"mySuperSecretCode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+ 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
};

// app.get("/",(req,res)=>{
//     res.send("Root");
// });




app.use(session(sessionOptions));
app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//server side validation can be comment out to see only mongoose validation error msgs


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error =req.flash("error");
    res.locals.currUser=req.user;
    next();
})

app.use("/listings", listingRouter)
app.use("/listings/:id/reviews", reviewRouter)
app.use("/",userRouter)






































app.all("*",(req,res,next)=>{
    next(new expressError(404,"Page not found!")); //always be stagged at bottom bcoz of * request it means all;
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err; //this 500 and something went wrong printed only when this is no status code but still there is some error this happen rarely ;
    res.status(statusCode).render("error.ejs",{err})
    // res.status(statusCode).send(message);
})