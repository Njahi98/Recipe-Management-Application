const express = require('express');
var morgan = require('morgan');
const mongoose = require('mongoose');
const authRoutes=require('./routes/authRoutes')
const contactRoutes=require('./routes/contactRoutes')
const isAuthenticated=require('./middleware/isAuthenticated')
const app = express();
const cookieParser = require('cookie-parser');

const userRecipeRoutes = require('./routes/user/recipe.routes');
const userProfileRoutes = require('./routes/user/profile.routes');
const userReviewRoutes = require('./routes/user/review.routes');

const adminRecipeRoutes = require('./routes/admin/recipe.routes');
const adminUserRoutes = require('./routes/admin/user.routes');
const adminRoutes = require('./routes/admin/admin.routes');

const dbURI=process.env.dbURI
mongoose.connect(dbURI)
.then((result)=>{
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
      })

})
.catch((error)=>console.log(error));

//needed for POST requests
app.use(express.urlencoded({ extended: true }));

// This lets Express read cookies
app.use(cookieParser()); 

//needed for JSON requests
app.use(express.json());

//using ejs view templates
app.set('view engine','ejs');

//enable static files in a public folder
app.use(express.static('public'));

//enable morgan for logs
app.use(morgan('dev'));

// we put auth middleware in the beginning so it runs on ALL routes
app.use(isAuthenticated);

app.get('/',(req,res)=>{
    res.render('index',{title:'Welcome to Recipes'
    })
})

app.get('/about',(req,res)=>{
    res.render('about',{title:'About Page'
    })
})
app.use("/auth",authRoutes);
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

app.use("/profile",userProfileRoutes);
app.use("/recipes",userRecipeRoutes);
app.use("/recipes",userReviewRoutes);

app.use("/admin/recipes",adminRecipeRoutes);
app.use("/admin/users",adminUserRoutes);
app.use('/admin/',adminRoutes);

app.use("/contact",contactRoutes);

app.use((req,res)=>{
    res.status(404).render('404',{title:'404 Not found'})
});

module.exports = app;












