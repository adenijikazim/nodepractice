const User = require('../Models/user')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors')
const { checkPermissions } = require('./auth')


const getAllUsers = async(req,res)=>{
    const users = await User.find({role:'user'}).select('-passoword')
    res.status(StatusCodes.OK).json({users})

}

const getSingleUser = async (req,res)=>{
    const user = await User.findOne({_id:req.params.id}).select('-password')
    if(!user){
        throw new BadRequestError('user not found')
    }
    checkPermissions(req.user, user._id)
    res.status(StatusCodes.OK).json({user})
}

const showCurrentUser = async(req,res)=>{
    res.status(StatusCodes.OK).json({user:req.user})
}

const updateUser = async(req,res)=>{
    const {name,email} = req.body
    if(!name || !email){
        throw new BadRequestError('please provide name and email')
    }
    const user = await User.findOne({_id:req.user.userId})
    user.name = name,
    user.email = email

    const oneDay = 1000*60*60*24
    const token = createJWT()
    res.cookie('token', token,{httpOnly:true,
        expires: new Date(Date.now() + oneDay),
        secure:process.env.NODE_ENV === 'production',
        signed:true })
    user.save()
    res.status(StatusCodes.OK).json({user:user.name, email:user.email})
}

const updateUserDetails = async(req,res)=>{
    const {email, name} = req.body
    if(!name || !email){
        throw new BadRequestError('please provide all values')
    }
    const user = await User.findOneAndUpdate(
        {_id:req.user.userId}, 
        {name,email},
        {new:true, runValidators:true})

        const oneDay = 1000*60*60*24
        const token = createJWT()
        res.cookie('token', token,{httpOnly:true,
            expires: new Date(Date.now() + oneDay),
            secure:process.env.NODE_ENV === 'production',
            signed:true })
        res.status(StatusCodes.OK).json({user:{name:user.name, email:user.email}})
}

const updateUserPassword = async(req,res)=>{
    const {oldPassword, newPassword} = req.body
    if(!oldPassword || !newPassword){
        throw new BadRequestError('please provide old and new password')
    }
    const user = await User.findOne({_id:req.user.userId})
    const isPasswordCorrect = user.comparePassword(oldPassword)
    if(!isPasswordCorrect){
        throw new UnauthenticatedError('old password is incorrect')
    }
    user.password = newPassword
    await user.save()
    res.status(StatusCodes.OK).json({msg:'password updated successfully'})

}

module.exports = {getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserDetails,
    updateUserPassword}