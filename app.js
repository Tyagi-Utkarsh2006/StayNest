const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js")
const path=require("path");
const methodoverride=require("method-override");
const ejsmate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const port=8080;

const MONGO_DB='mongodb://127.0.0.1:27017/test';
main()
    .then(() =>{
    console.log("database connected");
}).catch((err) =>{
 console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_DB);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.engine('ejs',ejsmate);
app.use(express.static(path.join(__dirname,"/public")));



app.get("/",(req,res) =>{
    res.send("this is app");
});

//index route
app.get("/listings", async(req,res) =>{
    let alllistings=await Listing.find({});
    res.render("./listings/index.ejs",{alllistings});
});

//new route
app.get("/listings/new",(req,res) =>{
    res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id",async(req,res) =>{
    let {id} =req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});

//create route
app.post("/listings",wrapAsync(async(req,res,next) =>{ //we add async function because we are going change in the database
  //let{title,description,image,price,country,location}=req.body;
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//edit route
app.get("/listings/:id/edit",async(req,res) =>{
    let {id} =req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
});

//update route
app.put("/listings/:id",async(req,res)=>{
    let {id} =req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
});

//delete route
app.delete("/listings/:id",async(req,res)=>{
    let {id} =req.params;
    let deletelisting=await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});



app.get("/testlisting",async(req,res) =>{
    let samplelisting=new listing({
        title:"My new Villa",
        description:"By the beach",
        price:12000,
        location:"Mumbai",
        country:"India",
    });
    await samplelisting.save();
    console.log("samole is saved");
    res.send("successful");
});

app.use((err,req,res,next) =>{
    res.send("something went wrong!");
});

app.listen(8080, () =>{
    console.log("app is listening");
});