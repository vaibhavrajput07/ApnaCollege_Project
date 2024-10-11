const Review=require("../model/review");
const Listing=require("../model/listing");

module.exports.createReview=async(req,res)=>{
    
    let listing1=await Listing.findById(req.params.id);
    console.log(listing1);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    listing1.reviews.push(newReview);

    await newReview.save();
    await listing1.save();
    req.flash("success","New review created!");
    res.redirect(`/listing/${listing1.id}`);
}
module.exports.destroyReview=async(req,res)=>{
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted!");
    res.redirect(`/listing/${id}`);
  }