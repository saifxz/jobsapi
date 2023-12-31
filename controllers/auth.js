const User=require('../models/User')
const StatusCode=require('http-status-codes')
const BadRequestError=require('../errors/bad-request')
const { UnauthenticatedError } = require('../errors')

const register=async (req,res)=>{
    const user=await User.create({...req.body})
    const token=user.createJWT()
    res.status(StatusCode.CREATED).json({user:{name:user.name},token})
}
const login=async (req,res)=>{
    const {password,email}=req.body
    console.log(req.body)
    if(!password||!email){
        throw new BadRequestError('please provide email and name')
    }
    const user =await User.findOne({email})

    if(!user){
        throw new UnauthenticatedError("Invalid credentials")
    }
    const isPasswordCorrect=await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new UnauthenticatedError("invalid password")
    }
    const token=user.createJWT()
    res.status(StatusCode.OK).json({user:{name:user.name},token})
}


module.exports={
    register,
    login
}