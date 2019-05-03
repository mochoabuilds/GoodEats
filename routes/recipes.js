var express     = require("express");
	var router      = express.Router();
	var Recipe      = require("../models/recipe");
	var middleware  = require("../middleware");
	
	
	//INDEX - show all recipes
	router.get("/", function(req, res){
	    var noMatch = null;
	    if(req.query.search) {
	        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
	        // Get all recipes from DB
	        Recipe.find({name: regex}, function(err, allRecipes){
	          if(err){
	              console.log(err);
	          } else {
	              if(allRecipes.length < 1) {
	                  noMatch = "No recipes match that search, please try again";
	              }
	              res.render("recipes/index",{recipes:allRecipes, noMatch: noMatch});
	          }
	        });
	    } else {
	        // Get all recipes from DB
	        Recipe.find({}, function(err, allRecipes){
	           if(err){
	               console.log(err);
	           } else {
	            //   ADD IN FOLLOWING RECIPE >> , noMatch: noMatch
	              res.render("recipes/index",{recipes:allRecipes, noMatch: noMatch});
	           }
	        });
	    }
	});
	
	
	// CREATE - add new recipes to db 
	router.post("/", middleware.isLoggedIn, function(req, res){
	   // get data from form and add to recipes array
	   var name = req.body.name;
	   var image = req.body.image;
	   var desc = req.body.description;
	   var author = {
	       id: req.user._id,
	       username: req.user.username
	   };
	   var newRecipe = {name: name, image: image, description: desc, author:author};
	   // create a new recipe and save to db
	   Recipe.create(newRecipe, function(err, newlyCreated){
	       if(err){
	           console.log(err);
	       } else {
	            // redirect back to recipes page
	            res.redirect("/recipes");
	       }
	   }); 
	});
	
	// NEW - show form to create new recipe 
	router.get("/new", middleware.isLoggedIn, function(req, res){
	    res.render("recipes/new"); 
	});
	
	// SHOW - show more info about one recipe
	router.get("/:id", function(req, res){
	    // find the recipe with provided ID
	    Recipe.findById(req.params.id).populate("comments").exec(function(err, foundRecipe){
	        if(err){
	            console.log(err);
	        } else {
	            console.log(foundRecipe);
	            // render show template with that recipe
	           res.render("recipes/show", {recipe: foundRecipe});
	        }
	    });
	});
	
	// EDIT RECIPE ROUTE 
	router.get("/:id/edit", middleware.checkRecipeOwnership, function(req, res){
	    Recipe.findById(req.params.id, function(err, foundRecipe){
	        res.render("recipes/edit", {recipe: foundRecipe});  
	    });
	});
	
	
	// UPDATE RECIPE ROUTE 
	router.put("/:id",middleware.checkRecipeOwnership, function(req, res){
	    // find and update the correct recipe
	    Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, function(err, updatedRecipe){
	        if(err){
	            res.redirect("/recipes");
	        } else { 
	            // redirect to show page
	            res.redirect("/recipes/" + req.params.id);
	        }
	    });
	});
	
	// DESTROY RECIPE ROUTE 
	router.delete("/:id",middleware.checkRecipeOwnership, function(req, res){
	    Recipe.findByIdAndRemove(req.params.id, function(err){
	        if(err){
	            res.redirect("/recipes");
	        } else {
	            res.redirect("/recipes"); 
	        }
	    });
	});
	
	// fuzzy search
	function escapeRegex(text) {
	    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	}
	
	module.exports = router;