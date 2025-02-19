const Contact = require('../models/contact');
const contact_index=(req,res)=>{
    res.render('contact',{title:'Contact'
    })
}

const contact_post = (req,res)=>{
    const contact = new Contact(req.body)
    contact.save()
    .then((result)=>{
        res.redirect('/recipes');
    }
    ).catch((error)=>{
        console.log(error);
    })
}




module.exports={contact_index,contact_post}