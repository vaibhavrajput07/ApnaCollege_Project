const express=require("express");
const review=express.Router({mergeParams:true});


const WrapAsync=require("../utilit/Async.js");
const ExpressError=require("../utilit/ExpressError.js");

const Listing = require("../model/listing");
const Review = require("../model/review.js");
const {reviewValidationErr,isLoggedIn,isReviewAuthor}=require("../middleware.js")

const reviewController=require("../controllers/review.js");

//Reviews
//create review
review.post("/",isLoggedIn, reviewValidationErr, WrapAsync(reviewController.createReview));

//Delete Route for reviews
review.delete("/:reviewId",isLoggedIn,isReviewAuthor, WrapAsync(reviewController.destroyReview));

module.exports=review;
