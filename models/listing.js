const mongoose = require('mongoose');
const Review = require("./review.js");
const User = require("./user.js")
const { reviewSchema } = require('../schema');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type : String,
        required:true,

    },
    description : String ,
    image : {      
        type: String,
        default:"https://images.unsplash.com/photo-1712831710551-97ac3c3442d3?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set:(v)=>v==="" ? "https://images.unsplash.com/photo-1712831710551-97ac3c3442d3?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v, 
    },   
    price : Number,
    location : String,
    country : String,
    review:[{
        type: Schema.Types.ObjectId,
        ref: "review",
    }],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});


//mongo postdelete  middleware
listingSchema.post('findOneAndDelete',async(listing)=>{
    if(listing){
        await Review.deleteMany({id:{$in : listing.review}})
    }
})


const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;

