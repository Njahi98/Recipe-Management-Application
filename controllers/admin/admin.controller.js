const Contact = require('../../models/contact');
const Recipe = require('../../models/recipe');
const User = require('../../models/user');

const admin_index = async(req,res)=>{
    // Basic counts
    const totalRecipes = await Recipe.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalContacts = await Contact.countDocuments();

    // User statistics
    const adminUsers = await User.countDocuments({ role: 'ADMIN' });
    const regularUsers = totalUsers - adminUsers;
    const usersWithSocialMedia = await User.countDocuments({
        $or: [
            { 'socialMedia.twitter': { $ne: '' } },
            { 'socialMedia.instagram': { $ne: '' } },
            { 'socialMedia.facebook': { $ne: '' } }
        ]
    });
    const usersWithCustomProfile = await User.countDocuments({
        imageId: { $ne: '/images/default-profile.png' }
    });

    // Recipe statistics
    const recipes = await Recipe.find();
    const totalReviews = recipes.reduce((sum, recipe) => sum + recipe.reviews.length, 0);
    const averageRating = recipes.reduce((sum, recipe) => sum + recipe.averageRating, 0) / totalRecipes || 0;
    const averageCookingTime = recipes.reduce((sum, recipe) => sum + recipe.cookingTime, 0) / totalRecipes || 0;
    
    // Category distribution
    const categoryCounts = await Recipe.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    // Difficulty distribution
    const difficultyCounts = await Recipe.aggregate([
        { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ]);

    // Contact statistics
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const contactsLast24Hours = await Contact.countDocuments({ createdAt: { $gte: last24Hours } });
    const contactsLast7Days = await Contact.countDocuments({ createdAt: { $gte: last7Days } });

    const stats = {
        // Basic stats
        recipes: totalRecipes,
        users: totalUsers,
        contacts: totalContacts,
        
        // User stats
        adminUsers,
        regularUsers,
        usersWithSocialMedia,
        usersWithCustomProfile,
        
        // Recipe stats
        totalReviews,
        averageRating: averageRating.toFixed(1),
        averageCookingTime: Math.round(averageCookingTime),
        categoryCounts,
        difficultyCounts,
        
        // Contact stats
        contactsLast24Hours,
        contactsLast7Days
    };

    try {
        return res.render('admin/admin', { title: 'Admin Panel', stats });
    } catch (error) {
        return res.status(500).render('500', { error: 'Something went wrong. Please try again later.' });
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