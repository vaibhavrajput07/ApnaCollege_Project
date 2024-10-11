const Listing=require("./model/listing");
const Review = require("./model/review");
const ExpressError=require("./utilit/ExpressError.js");
const {listingSchema}=require("./Schema.js");
const {reviewSchema}=require("./Schema.js");


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You must be logged in to create listing");
        req.session.redirectUrl = req.originalUrl;
        return res.redirect("/login"); 
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner=async(req,res,next)=>{
    let{id}=req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not owner of this listing");
        return res.redirect(`/listing/${id}`);   
    }
    next();
}

module.exports.listingValidationErr=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
         console.log(error);  
         if(error){
            let errMsg=error.details.map((el)=>el.message).join(",");
            throw new ExpressError(404,errMsg);
         }
         else{
            next();
         }
}


module.exports.reviewValidationErr=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
         console.log(error);  
         if(error){
            let errMsg=error.details.map((el)=>el.message).join(",");
            throw new ExpressError(404,errMsg);
         }
         else{
            next();
         }
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let{id,reviewId}=req.params;
    let review= await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not owner of this listing");
        return res.redirect(`/listing/${id}`);   
    }
    next();
}
