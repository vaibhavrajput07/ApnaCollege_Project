const User=require("../model/user.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
    // res.send("form");
}
module.exports.signup = async(req,res,next)=>{
    try{
        console.log("Signup 1");
        let{username,email,password}=req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to wanderlust");
            let redirect=req.session.redirectUrl || "/listing";
            res.redirect(redirect);
            
            // res.redirect(req.flash("success","Welcome to wanderlust"));
        })
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}
module.exports.login= async(req,res)=>{
    req.flash("success","Welcome back to in Wanderlust");
    let redirect=res.locals.redirectUrl || "/listing";
    res.redirect(redirect);
}
module.exports.logOut=(req,res,next)=>{
    req.logOut((err=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listing");
    }))
}