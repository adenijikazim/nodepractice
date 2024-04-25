const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'please enter name']
    },
    email:{
        type:String,
        required:[true, 'please prvide email'],
        lowercase:true,
        validate:{
            validator:validator.isEmail,
            message:"please enter correct email"
        }
    },

    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    password:{
        type:String,
        required:[true,'please enter password'],
        min:8
    },
    /*confirmPassword:{
        type:String,
        required:[true,'kindly confirm your password'],
        min:8,
        validate:{
           validator: function (el) {
                return el===this.password
            },
            message:"passwords are not the same"
        }

    }*/
})

userSchema.pre('save', async function(){
    if(!this.isModified('password')) return 
    const salt = await bcrypt.genSalt(10); // salt(this.password)
    this.password = await bcrypt.hash(this.password, salt);
    this.confirmPassword = undefined

})

userSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

userSchema.methods.createJWT =function(){
    const tokenUser = {name:this.name,userId:this._id,role:this.role}
   return jwt.sign(tokenUser, process.env.JWT_SECRET, {expiresIn:process.env.JWT_LIFETIME})
}

const User = mongoose.model('User', userSchema)
module.exports = User