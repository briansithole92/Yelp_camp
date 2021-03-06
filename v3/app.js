var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB = require("./seeds")
    
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();

app.get("/", function(req, res){
    res.render("landing");
});

// Index - show all campgrounds
app.get("/campgrounds", function(req, res){
    // get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
        if(err) {
            console.log("Error");
        } else {
            res.render("index", {campgrounds: allCampgrounds});
        }
    });
});


app.post("/campgrounds", function(req, res){
    // get data from form
    var name = req.body.name;
    var image= req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
    // add data to array
    
    // create a new campground and save to the db
    Campground.create(newCampground, function(err, newlycreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// show form to create new campground
app.get("/campgrounds/new", function(req, res) {
   res.render("new"); 
});

// show - shows more info about one campground
app.get("/campgrounds/:id", function(req, res) {
    // find the campground with the provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
        // render show tempalte with that campground
        res.render("show", {campground: foundCampground});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelpv3");
});