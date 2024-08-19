const express = require("express");
const router = express.Router({mergeParams:true});
const User = require("../models/user.js");
const passport = require("passport");
const{saveRedirectUrl} = require("../middleware.js")
const userController=require("../controllers/user.js")

router.get("/signup",userController.renderSignup)

router.post("/signup",userController.signup)

//login route

router.get("/login",userController.renderLoginForm);

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash: true, }),(userController.login))

// test credential

//username :- Test
//pass: - test_test

//logout

router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you're logged out now");
        res.redirect("/listings")
    })
})
module.exports=router;

