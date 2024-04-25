const User = require('../Models/user')
const {StatusCodes} = require('http-status-codes')
const jwt = require('jsonwebtoken')
const {BadRequestError, UnauthenticatedError} = require('../errors')
const UnauthorizedError = require('../errors/unauthorized')

const oneDay = 1000*60*60*24

const register = async(req,res)=>{
    // const {name,email,password,passwordConfirm} = req.body
    const {name,email,password} = req.body
    // const user = await User.create({name,email,password,passwordConfirm})
    const user = await User.create({name,email,password})
    const token = user.createJWT()
    res.cookie('token', token,{httpOnly:true,
        expires: new Date(Date.now() + oneDay),
        secure:process.env.NODE_ENV === 'production',
        signed:true })
    res.status(StatusCodes.CREATED).json({user:{username:user.name, userEmail:user.email}})
    // res.status(StatusCodes.CREATED).json({user:{user:user.name},token})
}

const login = async(req,res)=>{
    const {email,password}= req.body
    if(!email || !password){
        throw new BadRequestError('please provide email and password')
    }

    const user = await User.findOne({email})
    if(!user){
        throw new UnauthenticatedError('please provide a valid login credentials')
    }
    const isPasswordCorrect = user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new UnauthenticatedError('Invalid login credentials')
    }

    const token = user.createJWT()
    res.cookie(
        'token', token,
        {httpOnly:true, 
        expires:new Date(Date.now() + oneDay), 
        signed:true})
    res.status(StatusCodes.OK).json({user:user.email, name:user.name,userId:user._id})
}

const logout = async(req,res)=>{
    res.cookie('token','logout',{
        httpOnly:true,
        expires:new Date(Date.now() + 5 * 1000),
    })
    res.status(StatusCodes.OK).json({msg:'user logged out'})
}

const authenticateUser = async(req,res,next)=>{
    const token = req.signedCookies.token;
    if(!token){
        throw new UnauthenticatedError('authentication invalid')}
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET)
            console.log(payload)
            req.user = {userId:payload.userId, name:payload.name, role:payload.role}
            next()
        } catch (error) {
            throw new UnauthenticatedError('Invalid credentials')
        }
   /* if(!req.headers.authorization || !req.headers.authorization.StartsWith('Bearer')){
        throw new UnauthenticatedError('Invalid login details')
    }

    const token = req.headers.authorization.split(' ')[1]
    try {
        const payload = jwt.verify(token, 'JWTSECRET')
        console.log(payload)
        req.user = {userId:payload.userId}
        
    } catch (error) {
        throw new UnauthenticatedError('Invalid credentials')
        
    }*/
}

const authorizePermission = async(req,res,next)=>{
    console.log('admin route')
    if(req.user.role !== 'admin'){
        throw new UnauthorizedError('Unauthorized to access this route')
    }
    next()

}
/*const authorizePermission = async(...roles)=>{
    console.log(roles)
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            throw new UnauthorizedError('unauthorized to access this route')
        }
        next()
    }
}*/

const checkPermissions = async(requestUser,resourceUserId)=>{
    if(requestUser.role === 'admin') return
    if(requestUser.userId === resourceUserId.toString()) return
    throw new UnauthorizedError('you are not allowed to access this resource')
}

module.exports = {
    register,login,logout,authenticateUser, authorizePermission, checkPermissions
}