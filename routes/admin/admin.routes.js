const express = require('express');
const isAuthenticated = require('../../middleware/isAuthenticated');
const isAdmin = require('../../middleware/isAdmin');
const router = express.Router();
const Contact = require('../../models/contact');

router.get('/',isAuthenticated, isAdmin, async(req,res)=>{
    try {
        return res.render('admin/admin',{title:'Admin Panel'});
    } catch (error) {
        return res.status(500).render('500',{error:'Something went wrong. Please try again later.'});
        
    }
})

router.get('/contact',isAuthenticated,isAdmin, async(req,res)=>{
    try {
        const contacts = await Contact.find();
        return res.status(200).render('admin/contact',{title:'contact mails',contacts:contacts || []});
    } catch (error) {
        return res.status(500).json({error:'unable to fetch contact mails. Please try again later.'});
    }
})

router.delete('/contact/:id',isAuthenticated,isAdmin,async(req,res)=>{
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
})





module.exports = router;