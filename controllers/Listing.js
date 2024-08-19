const Listing = require("../models/listing")

module.exports.index=(async (req,res)=>{            //listings/
    const allListings = await Listing.find({})
    res.render("listings.ejs",{allListings});
})

module.exports.renderNewForm=((req,res)=>{  
    res.render("new.ejs");
});

module.exports.showListing=(async (req,res)=>{          // listings/:id
    let {id} = req.params;
    let x = await Listing.findById(id).populate({path:"review",populate:{path:"author"},}).populate("owner")
    console.log(x);
    res.render("show.ejs",{x});
});

module.exports.createListing=(async (req,res)=>{        // listings/
    // let {title , description ,image,price,country, location}= req.body;
    // let newList= new Listing({
    //     title:title,
    //     description:description,
    //     image:image,
    //     price:price,
    //     country:country,
    //     location:location,
    // })
    let listing =req.body.listing;
    const newList = new Listing (req.body.listing);
    newList.owner=req.user._id;
    await newList.save();
    req.flash("success","New Listing is added!..")
    res.redirect("/listings")
});

module.exports.renderEditPage=(async(req,res)=>{      // /listing/:id/edit
    let {id} = req.params;
    let x = await Listing.findById(id);
    res.render("edit.ejs",{x})
})

module.exports.updateListing=(async(req,res)=>{       //listings/:id/update
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    // const { title:title, description:description, image:image, price:price, country:country, location:location } = req.body;
    // let updatedListing= await Listing.findByIdAndUpdate(id,{title:title, description:description, image:image, price:price, country:country, location:location })
    req.flash("success","Listing is Updated!..")
    res.redirect(`/listings/${id}`);

})

module.exports.destroyListing=(async(req,res)=>{              //listings/:id
    let {id} = req.params;   
    let deleted_listing = await Listing.findByIdAndDelete(id);
    console.log(deleted_listing);
    req.flash("success","Listing is Deleted!..")
    res.redirect("/listings")
})