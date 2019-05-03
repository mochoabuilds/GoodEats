var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Recipe          = require("./models/recipe"),
    Comment         = require("./models/comment"),
    User            = require("./models/user");
  
// requiring routes    
var commentRoutes   = require("./routes/comments"),
    recipeRoutes    = require("./routes/recipes"),
    indexRoutes     = require("./routes/index");

mongoose.connect("mongodb+srv://mochoabuilds:kangaroo@goodeats-r3whh.mongodb.net/test?retryWrites=true", {useNewUrlParser: true});
// mongoose.connect("mongodb://localhost:27017/good_eats", {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended:true})); 
app.set("view engine", "ejs"); 
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// passport configure
app.use(require("cookie-session")({
    secret: "What's cooking?",
    resave: false,
    saveUninitialized: false  
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 
// middleware added to templates 
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// adds prefixes to routes
app.use("/", indexRoutes);
app.use("/recipes", recipeRoutes);
app.use("/recipes/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
  console.log("Server is up!");
});

