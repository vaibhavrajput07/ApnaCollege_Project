const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing = require("../model/listing.js");


main()
.then(()=>console.log("Database created.."))
.catch(err=>console.log(err));

async function main(){
    const url="mongodb://127.0.0.1:27017/wanderlust";
    await mongoose.connect(url);
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj, owner : '66fe69ddb6beca08022ff654',}))
    await Listing.insertMany(initData.data);
    console.log("data was saved");
}

initDB();