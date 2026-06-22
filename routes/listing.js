const express = require("express");
const router = express.Router({mergeParams:true})
const { listingSchema } = require("../schema.js")
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js")
const { isLogedIn ,isOwner,validateListing } = require("../middleware.js");
const listingControllers = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage })

// ALL LISTINGS
router.get("/",listingControllers.index ) 
 
// New Form
router.get("/new", isLogedIn, listingControllers.newListingForm)

// CREATE ROUTE
router.post("/create",isLogedIn,upload.single("listing[image]"),validateListing,listingControllers.createListing)


// Edit Route
router.get("/:id/edit",isLogedIn,isOwner,listingControllers.listingEditForm)

// SHOW ROUTE
router.get("/:id/show", listingControllers.showListing)

// UPDATE ROUTE
router.route("/:id")
    .put(isLogedIn,isOwner,upload.single("listing[image]"),validateListing, listingControllers.updateListing)
    .delete(isLogedIn,isOwner, listingControllers.destroyListing)

module.exports = router;