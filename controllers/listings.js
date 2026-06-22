const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");


module.exports.index = async (req,res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings})
} 

module.exports.newListingForm = (req,res) => {
    res.render("listings/new.ejs")
}

module.exports.createListing = async (req,res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url,filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url , filename };
    await newListing.save();
    req.flash("success","New Listing created");
    res.redirect("/listings");
}

module.exports.listingEditForm =  async(req,res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error","The listing you want to edit des not exist!");
        res.redirect("/listings")
        return;
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl})
}

module.exports.showListing = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","The listing you want to show does not exist!");
        res.redirect("/listings");
        return;
    }
    res.render("listings/show.ejs",{listing})
}

module.exports.updateListing = async (req,res) => {
    
    if(!req.body.listing) {
        throw new ExpressError(404,"Listing data should be filled valid");
    }
    let {id} = req.params;    
    if(!listing){
        req.flash("error","The listing you want to update does not exist!")
        res.redirect('/listings');
        return;
    }
    let updatedListing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = {url,filename};
        await updatedListing.save();
    }
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}/show`);

}

module.exports.destroyListing = async(req,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    if(!listing) {
        req.flash("error","The listing you want to delete does not exist");
        res.redirect("/listings");
        return;
    }
    res.redirect("/listings");
}