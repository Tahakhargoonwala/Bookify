const express = require("express");
const router = express.Router({mergeParams:true});
const {listingSchema,reviewSchema} = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review");
const expressError = require("../utils/expressError");

const {isLoggedIn} = require('../middleware')
const reviewController = require("../controllers/reviews.js")




const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        throw new expressError(400,error)
    }
    next();
}






//review route

//POST route 
//server side validation is pending



router.post("/",isLoggedIn,wrapAsync(reviewController.createReview));

//delete route

router.delete("/:reviewId",wrapAsync(reviewController.deleteReview))


module.exports=router;