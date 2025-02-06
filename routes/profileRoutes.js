const express = require("express");
const User = require("../models/user");
const router = express.Router();
const auth = require("../middleware/auth");

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
module.exports = router;
