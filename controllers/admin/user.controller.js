const User = require("../../models/user")



const admin_user_index = async(req,res)=>{
    try {
        const users = await User.find().select('-password');
        if(users.length === 0 ){
            return res.status(404).json({error:'no users available'});
        }
        return res.status(200).json({message:'users fetched successfully',users});

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



module.exports={
    admin_user_index,
    admin_user_details,
    admin_user_update,
    admin_user_delete,
}