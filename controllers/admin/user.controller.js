const User = require("../../models/user")
const { getGfs } = require("../../middleware/uploadMiddleware");
const mongoose = require("mongoose");


const admin_user_index = async(req,res)=>{
    try {
        const users = await User.find().select('-password');
        if(users.length === 0 ){
            return res.status(404).json({error:'no users available'});
        }        
        return res.status(200).render('admin/users', {
            title:'Users management',
            users:users || []}
        );
    } catch (error) {
        return res.status(500).json({error:'error fetching users'});
    }

}

const admin_user_details = async(req,res)=>{
    try {
        const userId=req.params.userId;
        const user = await User.findById(userId).select('-password');
    
        if(!user){
            return res.status(404).json({error:'user not found'});
        }

        return res.status(200).json({message:'user fetched successfully',user});

    } catch (error) {
        return res.status(500).json({error:'error fetching user'});

    }
}

const admin_user_update = async(req,res)=>{
    try {

    const userId = req.params.userId;
    // an admin user cannot update his role to for example "USER"
    if(userId === req.userId){
        return res.status(403).json({error:'You cannot update your own Role as you have admin privileges'});
    }

    const formData = req.body;

   // we add validation for formData
   if (Object.keys(formData).length === 0) {
    return res.status(400).json({ error: 'No update data provided' });
}
    
    const updatedUser = await User.findByIdAndUpdate(userId,formData,{ new: true });
    if(!updatedUser){
        return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({message:'user updated successfully',user:updatedUser})
} catch (error) {
    console.log(error);
    return res.status(500).json({error:'error updating user'});
}
}

const admin_user_delete = async(req,res)=>{
    try {
        const userId = req.params.userId;

        //logged-in admin-user cannot delete his own account as he's logged-in 

        if(userId === req.userId){
            return res.status(403).json({error:'The logged-in User cannot delete his own account.'})
        }

        const user = await User.findById(userId).select('-password');
    
        if(!user){
            return res.status(404).json({error:'user not found'});
        }

        const result = await User.findByIdAndDelete(userId);
        if(!result){
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({message:'user deleted successfuly',redirect:'/admin/users'})
    } catch (error) {
        return res.status(500).json({error:'error deleting user'});

    }

}

const user_image_get = async (req, res) => {
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


module.exports={
    admin_user_index,
    admin_user_details,
    admin_user_update,
    admin_user_delete,
    user_image_get,
}