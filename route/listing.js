const express=require("express");
const list=express.Router();

const Listing = require("../model/listing");
const WrapAsync=require("../utilit/Async.js");

const {isLoggedIn,isOwner,listingValidationErr}=require("../middleware.js");
const { populate } = require("../model/review.js");
const listingController=require("../controllers/listing.js");

const multer=require('multer');
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

list.route("/")
.get(WrapAsync(listingController.index))
.post(
    isLoggedIn,
    upload.single('listing[image]'),
    listingValidationErr,
    WrapAsync(listingController.createListing));

//New Route
list.get("/new",isLoggedIn,listingController.renderNewForm);

list.route("/:id")
.get(WrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'), listingValidationErr, WrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, WrapAsync(listingController.destroyListing));



//Edit Route
list.get("/:id/edit",isLoggedIn,isOwner, WrapAsync(listingController.editForm));

module.exports=list;