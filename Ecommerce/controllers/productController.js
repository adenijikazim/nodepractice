const Product = require('../Models/productModel')
const {StatusCodes} = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const createProduct = async(req,res)=>{
    req.body.user = req.user.userId
    const product = await Product.create(req.body)
    res.status(StatusCodes.CREATED).json({product})

}

const getSingleProduct = async(req,res)=>{
    const productId = req.params.id
    const product = await Product.findOne({_id:productId}).populate('reviews')
    if(!product){
        throw new NotFoundError(`No product with id ${productId}`)
    }
    res.status(StatusCodes.OK).json({product})
}

const getAllProducts = async(req,res)=>{
    const products = await Product.find({})
    res.status(StatusCodes).json({products})
}

const updateProduct = async(req,res)=>{
    const productId = req.params.id
    const product = await Product.findOneAndUpdate(
        {_id:productId},req.body,
        {runValidators:true,new:true})
        if(!product){
            throw new NotFoundError(`No product with id ${productId}`)
        }
        res.status(StatusCodes).json({product})
}

const deleteProduct = async(req,res)=>{
    const productId = req.params.id
    const product = await Product.findOne({_id:productId})
    if(!product){
        throw new NotFoundError('product not found')
    }
    await product.remove()
    res.status(StatusCodes.OK).json('product successfully removed')
}

const uploadImage = async(req,res)=>{
    res.send('upload image')
}


module.exports = {
    createProduct,getSingleProduct,getAllProducts,updateProduct,deleteProduct,uploadImage
}