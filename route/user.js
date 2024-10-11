const express=require("express");
const WrapAsync=require("../utilit/Async.js");
const router=express.Router();
const User=require("../model/user.js");
const { route } = require("./listing");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/user.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(saveRedirectUrl, WrapAsync(userController.signup))

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,
    passport.authenticate("local",
        {failureRedirect:'/login',
         failureFlash:true
        }),
       userController.login);

router.get("/logout",userController.logOut);
module.exports=router;