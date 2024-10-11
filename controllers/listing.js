const Listing=require("../model/listing");

module.exports.index=async(req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};
module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};
module.exports.showListing=async(req,res)=>{
    let{id}=req.params;
    const listing= await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    }).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listing");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing=async(req,res)=>{  
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url, "..." ,filename);
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New listing created!");
    res.redirect("/listing");
}

module.exports.editForm=async(req,res)=>{
    let{id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listing");
    }
    let OriginalImageUrl=listing.image.url;
    OriginalImageUrl=OriginalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing, OriginalImageUrl});
}
module.exports.updateListing=async(req,res)=>{
    let{id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if(typeof req.file!== "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success","listing updated!");
    res.redirect(`/listing/${id}`);
}
module.exports.destroyListing=async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted!");
    res.redirect("/listing");
}