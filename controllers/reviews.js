const Review = require("../models/review")
const Listing = require("../models/listing");

module.exports.createReview=(async(req,res)=>{      // /listings/:id/reviews
    let {id} = req.params;
    let listing =await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user.id;
    console.log(newReview);
    listing.review.push(newReview)
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`)

})

module.exports.deleteReview=(async(req,res)=>{   //listings/:id/reviews/:reviewId
    let {id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId)
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}})
    res.redirect(`/listings/${id}`)
})