const Recipe = require('../models/recipe')


const recipe_index = (req,res)=>{
    res.render('recipes/index',{title:'recipes'})
}

const recipe_create_get = (req,res)=>{

}

const recipe_create_post = (req,res) =>{
    const recipe = new Recipe();
    recipe.save()
    .then((result)=>{
        res.redirect("/recipes");
    }).catch((error)=>{
        console.log(error);
    })
}

const recipe_details = (req,res)=>{

}

const recipe_delete = (req,res) =>{

}





module.exports={
    recipe_index,
    recipe_create_get,
    recipe_create_post,
    recipe_details,
    recipe_delete
}