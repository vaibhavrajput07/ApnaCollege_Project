if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utilit/ExpressError.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./model/user.js");

const listRouter=require("./route/listing.js");
const reviewsRouter=require("./route/review.js");
const userRouter=require("./route/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);

const dbUrl=process.env.ATLASDB_URL;
main()
.then(()=>console.log("Database created.."))
.catch(err=>console.log(err));

async function main(){
    await mongoose.connect(dbUrl);
}


const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("Error in MONGO SESSION STORE");
})
const sessionOption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized : true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}

app.use(session(sessionOption));
app.use(flash());   //always add thi first

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/",(req,res)=>{
//     res.send("Hi! i am root");
// });

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

// app.get("/demoUser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"Student@123",
//         username:"delta-student"
//     });
//    let registeredUser=await User.register(fakeUser,"helloworld");
//    res.send(registeredUser);
// })

app.use("/listing",listRouter);
app.use("/listing/:id/review",reviewsRouter);
app.use("/",userRouter);



//Error Handlers

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"))
});
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
});
app.listen("8080",()=>{
    console.log("listen...");
});