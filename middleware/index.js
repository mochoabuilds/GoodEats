var Recipe = require("../models/recipe");
var Comment = require("../models/comment");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkRecipeOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Recipe.findById(req.params.id, function(err, foundRecipe){
           if(err){
               req.flash("error", "No recipe found");
               res.redirect("back");
           }  else {
               // does user own the recipe?
            if(foundRecipe.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "Please login");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "Please login");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "Please login");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "Please login");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login");
    res.redirect("/login");
};

module.exports = middlewareObj;