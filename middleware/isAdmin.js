const User = require("../models/user");

const isAdmin= async(req,res,next)=>{    
    try {   
    const userId = req.userId;
    const user = await User.findById(userId);
    if(!user){
        return res.status(404).json({error:'User not found'});
    }
    if(user.role==="ADMIN"){
        req.isAdmin=true;
        next();
    }
    return res.status(403).json({error:'insufficient privileges'});
    
    } catch (error) {
        return res.status(500).json({error:'Error verifiying User Role'})    
    }
}

module.exports=isAdmin;