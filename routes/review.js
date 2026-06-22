const express = require("express");
const router = express.Router( {mergeParams:true} );
const reviewController = require("../controllers/reviews.js");


const { validateReview,isAuthor } = require("../middleware.js");

router.post("/",validateReview,reviewController.createReview)


router.delete("/:reviewId",isAuthor,reviewController.destroyReview);

module.exports = router;