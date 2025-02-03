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

const contact_posting = async (req,res) =>{
    try {
        const contact = new Contact(req.body);
        const response = await contact.save()
        if(response.ok){
            res.redirect('/recipes');
        }else{
            res.json({message:'error occured'})
        }
    } catch (error) {
        res.json({error:'error:',error})
    }
}



module.exports={contact_index,contact_post}