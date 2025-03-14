const mongoose = require("mongoose");
const Recipe = require("../../models/recipe");
const User = require("../../models/user");
const { getGfs } = require("../../middleware/uploadMiddleware");

const user_profile_index = async (req, res) => {
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
  }

const user_profile_edit_get = async(req,res)=>{
    try {
        const userId=req.params.id;
        if (userId !== req.userId) {
          return res.redirect(`/profile/${userId}?error=unauthorized`);
        }
        const profile = await User.findById(userId).select('-password');
        if(!profile){
            return res.status(404).json({ error: "user does not exist" });
        }
        res.render("profile/edit",{title:'Edit Profile',profile});
    } catch (error) { 
        res.json('error:',error);
    } 
}

const user_profile_update = async (req, res) => {
    try {
      const userId = req.params.id;
  
      if (userId !== req.userId) {
        return res
          .status(403)
          .json({ error: "You are not authorized to update this profile" });
      }
      const formData =   {
        bio: req.body.bio,
        location: req.body.location,
        website: req.body.website,
        socialMedia: req.body.socialMedia,
      }
          // If new image was uploaded
          if (req.file) {
            // Delete old image if exists
            const oldProfileImage = await User.findById(userId);
            if (oldProfileImage.imageId) {
              const gfs = await getGfs();
              try {
                await gfs.delete(new mongoose.Types.ObjectId(oldProfileImage.imageId));
              } catch (err) {
                console.log("Error deleting old image:", err);
              }
            }
      
            // Add new image details to formData
            formData.imageId = req.file.id;
            formData.imageName = req.file.filename;
          }
  
      const updatedProfile = await User.findByIdAndUpdate(
        userId,
        formData,
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
  }

  const user_profile_image_get = async (req, res) => {
    try {
      // we ensure gfs is initialized
      const gfs = await getGfs(); 
      const fileId = req.params.id;
  
      const file = await gfs
        .find({ _id: new mongoose.Types.ObjectId(fileId) })
        .toArray();
  
      if (!file || file.length === 0) {
        return res.status(404).json({ message: "File not found" });
      }
  
      const readStream = gfs.openDownloadStream(
        new mongoose.Types.ObjectId(fileId)
      );
      readStream.pipe(res);
    } catch (error) {
      console.error("Error fetching profile image:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } 

  const user_profile_reviewRecipes_get = async(req,res)=>{
    try {
      const userId=req.params.id;
      const recipes = await Recipe.find();
  
      const userRecipes= recipes
      .filter(recipe=>{
        return !recipe.isGuest && recipe.creator.toString()===userId
      })
      .map(recipe=>{
         return {id:recipe._id,
                 title:recipe.title,
                 description:recipe.description,
                 imageId:recipe.imageId,
                 imageName:recipe.imageName,
                 createdAt:recipe.createdAt,
         } 
      });
  
      const userReviews= recipes.map(recipe => {
        return {
          recipe:{title:recipe.title,id:recipe._id},
          reviews:recipe.reviews.filter(review=> !review.isGuest && review.userId.toString()===userId)
        };
      }).filter(recipe => recipe.reviews.length > 0); // we only include recipes with reviews from the user
  
  
      
      return res.status(200).json({message:'Reviews fetched successfully',userReviews,userRecipes});
    } catch (error) {
      return res.status(500).json({error:'Error fetching Reviews'});
    }
  }

  module.exports={
    user_profile_index,
    user_profile_edit_get,
    user_profile_update,
    user_profile_image_get,
    user_profile_reviewRecipes_get,
  }