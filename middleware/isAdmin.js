const User = require("../models/user");

const isAdmin= async(req,res,next)=>{    
    try {   
    const userId = req.userId;
    const user = await User.findById(userId);
    if(!user){
        return res.redirect('/auth/login');
    }
    if(user.role==="ADMIN"){
      return  next();
    }
    return res.status(403).render('403', {
            title: 'Access Denied',
            error: 'Insufficient privileges'
        });    
    } catch (error) {
        return res.status(500).render('505',{title:'error occured',error:'Error verifiying User Role'})    
    }
}

module.exports= isAdmin;