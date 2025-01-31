const express = require('express');
var morgan = require('morgan');
const mongoose = require('mongoose');
const recipeRoutes=require('./routes/recipeRoutes')
const auth=require('./routes/auth')
const Contact = require('./models/contact')
const app = express();

const dbURI=process.env.dbURI
mongoose.connect(dbURI)
.then((result)=>{
    // Only listen directly when not running on Vercel
    if (process.env.NODE_ENV !== 'production') {
        app.listen(3000);
    }   
})
.catch((error)=>console.log(error));

//needed for POST requests
app.use(express.urlencoded({ extended: true }));
//needed for JSON requests
app.use(express.json());
//using ejs view templates
app.set('view engine','ejs');
//enable static files in a public folder
app.use(express.static('public'));
//enable morgan for logs
app.use(morgan('dev'));

app.get('/',(req,res)=>{
    res.render('index',{title:'Welcome to Recipes'})
})

app.get('/about',(req,res)=>{
    res.render('about',{title:'About Page'})
})

app.get('/contact',(req,res)=>{
    res.render('contact',{title:'Contact'})
})
app.post('/contact',(req,res)=>{
    const contact = new Contact(req.body)
    contact.save()
    .then((result)=>{
        res.redirect('/recipes');
    }
    ).catch((error)=>{
        console.log(error);
    })
})

app.use("/recipes",recipeRoutes);
app.use("/auth",auth);

app.use((req,res)=>{
    res.status(404).render('404',{title:'404 Not found'})
});

module.exports = app;












