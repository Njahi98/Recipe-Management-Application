const Contact = require('../../models/contact');
const Recipe = require('../../models/recipe');
const User = require('../../models/user');

const admin_index = async(req,res)=>{
    const totalRecipes = await Recipe.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalContacts = await Contact.countDocuments();

    const stats={
        recipes:totalRecipes,
        users:totalUsers,
        contacts:totalContacts
    };

    try {
        return res.render('admin/admin',{title:'Admin Panel',stats});
    } catch (error) {
        return res.status(500).render('500',{error:'Something went wrong. Please try again later.'});
        
    }
}

const admin_contact_index = async(req,res)=>{
    try {
        const contacts = await Contact.find();
        return res.status(200).render('admin/contact',{title:'contact mails',contacts:contacts || []});
    } catch (error) {
        return res.status(500).json({error:'unable to fetch contact mails. Please try again later.'});
    }
}

const admin_contacts = async(req,res)=>{
    try {
        const contacts = await Contact.find();
        return res.status(200).json({contacts:contacts || []});
    } catch (error) {
        return res.status(500).json({error:'unable to fetch contact mails. Please try again later.'});
    }
}


const admin_contact_delete = async(req,res)=>{
    try {
        const contactId = req.params.id;
        const contact = await Contact.findByIdAndDelete(contactId);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found.' });
        }

        return res.status(200).json({message:'Contact deleted successfully'})        
        
    } catch (error) {
        console.error('Error deleting contact:', error);
        return res.status(500).json({error:'unable to delete contact. Please try again later.'});
    }
}


module.exports={
    admin_index,
    admin_contact_index,
    admin_contacts,
    admin_contact_delete
}