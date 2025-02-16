const express = require("express");
const User = require("../models/user");
const router = express.Router();
const auth = require("../middleware/auth");
const Recipe = require("../models/recipe");

router.get("/:id", async (req, res) => {
  try {
    const profileId = req.params.id;
    const profile = await User.findById(profileId).select("-password");
    if (!profile) {
      return res.status(404).json({ error: "user does not exist" });
    }
    res.render("profile/profile", { title: "Profile", profile: profile });
  } catch (error) {
    return res.status(500).json({ error });
  }
});
//we protect this route by adding auth
//only the logged in user should be able to update his profile
//this takes us to the edit page and it's protected by auth and by comparing the request id to the logged user's id
router.get("/:id/edit",auth,async(req,res)=>{
    try {
        const userId=req.params.id;
        if (userId !== req.userId) {
          return res
            .status(403)
            .json({ error: "You are not authorized to update this profile" });
        }
        const profile = await User.findById(userId).select('-password');
        if(!profile){
            return res.status(404).json({ error: "user does not exist" });
        }
        res.render("profile/edit",{title:'Edit Profile',profile});
    } catch (error) { 
        res.json('error:',error);
    }
   
})
router.put("/:id", auth, async (req, res) => {
  try {
    const userId = req.params.id;

    if (userId !== req.userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this profile" });
    }

    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      {
        bio: req.body.bio,
        profilePicture: req.body.profilePicture,
        location: req.body.location,
        website: req.body.website,
        socialMedia: req.body.socialMedia,
      },
      // Return the updated document
      { new: true } 
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating profile" });
  }
});

router.get('/:id/reviews', async(req,res)=>{
  try {
    const userId=req.params.id;
    const recipes = await Recipe.find();

    const userReviews= recipes.map(recipe => {
      return {
        recipe:{title:recipe.title,id:recipe._id},
        reviews:recipe.reviews.filter(review=> review.userId.toString()===userId)
      };
    }).filter(recipe => recipe.reviews.length > 0); // we only include recipes with reviews from the user


    if(!userReviews.length){
      return res.status(404).json({error:'Reviews not found'});
    }
    
    return res.status(200).json({message:'Reviews fetched successfully',userReviews});
  } catch (error) {
    return res.status(500).json({error:'Error fetching Reviews'});
  }
})
module.exports = router;
