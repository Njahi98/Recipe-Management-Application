const express = require('express');
var morgan = require('morgan');
const mongoose = require('mongoose');
const recipeRoutes=require('./routes/recipeRoutes')

const app = express();

const dbURI=process.env.dbURI
mongoose.connect(dbURI)
.then((result)=>{
    app.listen(3000);
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
    res.redirect('/recipes');
})

app.use("/recipes",recipeRoutes);


app.use((req,res)=>{
    res.status(404).render('404',{title:'404 Not found'})
});













