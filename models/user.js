const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
username:{
    type:String,
    required:true,
    unique:true,
},
email:{
    type:String,
    required:true,
    unique:true,
},
password:{
    type:String,
    required:true,
}

},{timestamps:true});

//we hash the password before saving

userSchema.pre('save', async function (next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,10);
    }
    next();
});

//we compare the password for login
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password,this.password);
};

const User = mongoose.model('User',userSchema);

module.exports=User;
