const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync")  //for async eroor hadling no need touse try and catch
const expressError = require("../utils/expressError");
const {listingSchema,reviewSchema} = require("../schema.js");
const Listing = require("../models/listing");
const {isLoggedIn} = require("../middleware.js");
const ListingControl = require("../controllers/Listing.js");



const validatelisting=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        throw new expressError(400,error)
    }
    next();
}


//router.route => creating more compact by merging same reqs routes

router  //Index and create route are merged
    .route("/")
    .get(wrapAsync(ListingControl.index))
    .post(isLoggedIn,validatelisting, wrapAsync(ListingControl.createListing));



//Index route
// router.get("/",wrapAsync(ListingControl.index));
//new route
router.get("/new", isLoggedIn,ListingControl.renderNewForm) 
//show route
router.get("/:id",wrapAsync(ListingControl.showListing));

//create route
// router.post("/",isLoggedIn,validatelisting, wrapAsync(ListingControl.createListing));

//edit route

router.get("/:id/edit",isLoggedIn,wrapAsync(ListingControl.renderEditPage));

//update route

router.patch("/:id/update",isLoggedIn,validatelisting,wrapAsync(ListingControl.updateListing));


//delete route
router.delete("/:id",isLoggedIn,wrapAsync(ListingControl.destroyListing));

module.exports=router;