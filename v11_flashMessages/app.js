var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    methodOverride  = require("method-override"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local")

 // requring routes  
var commentRoutes = require("./routes/comments"),
    campgroundRoutes =require("./routes/campgrounds"),
    indexRoutes = require("./routes/index")
    
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/yelp_camp_final", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

// passport config
app.use(require("express-session")({
    secret: "I have made a secret page",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMkju_Y01iw0ReAFkH7Zh_MrD9GyxzuYAEMKeiK0hzrG8oNK0Kgw",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser  = req.user;
    res.locals.error      = req.flash("error");
    res.locals.success      = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes); // specific
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The final version of YelpCamp");
});