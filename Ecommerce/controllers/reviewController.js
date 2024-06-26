const {StatusCodes} = require('http-status-codes')
const Product = require('../Models/productModel')
const Review = require('../Models/reviewModel')
const { checkPermissions } = require('./auth')
const { BadRequestError, NotFoundError } = require('../errors')



const createReview = async (req,res)=>{
    const {product:productId} = req.body;
    const isValidProduct = await Product.findOne({_id:productId})
    if(!isValidProduct){
        throw new NotFoundError(`No product with id ${productId}`)
    }
    
    const alreadySubmitted = await Review.findOne({
        product:productId, 
        user:req.user.userId})
        
        if(alreadySubmitted){
            throw new BadRequestError('Already submitted review for this product')
        }
        
    req.body.user = req.user.userId;
    const review = await Review.create(req.body)
    res.status(StatusCodes.CREATED).json({review})
}

const getAllReviews = async(req,res)=>{
    const reviews = await Review.find()
    .populate({path:'user', select:'name company'})
    .populate({path:'user', select:'name'})
    res.status(StatusCodes.OK).json({reviews, count:reviews.length})
}

const getSingleReview = async(req,res)=>{
const {id:reviewId} = req.params /* const reviewId = req.params.id */
const review = await Review.findOne({_id:reviewId})
if(!review){
    throw new NotFoundError(`No review with id: ${reviewId}`)
}
res.status(StatusCodes.OK).json({review})
}

const updateReview =async (req,res)=>{
    const {id:reviewId} = req.params
    const {rating, title, comment} = req.body
    const review = await Review.findOne({_id:reviewId})
    if(!review){
        throw new NotFoundError(`No review with id: ${reviewId}`)
    }

    checkPermissions(req.user, review.user)

    review.rating = rating
    review.title = title
    review.comment = comment

    await review.save()
    res.status(StatusCodes.OK).json({review})
}

const deleteReview = async(req,res)=>{
    const {id:reviewId} = req.params
    const review = await Review.findOne({_id:reviewId})
    if(!review){
        throw new NotFoundError(`No review with id: ${reviewId}`)
    }
    checkPermissions(req.user, review.user)
    await review.remove()
    res.status(StatusCodes.OK).json({message:'review has been successfully deleted'})

}

getSingleProductReviews = async(req,res)=>{
    const {id:productId} = req.params
    const reviews = await Review.find({product:productId})
    res.status(StatusCodes).json({reviews, count:reviews.length})
}

module.exports= {
    createReview,getAllReviews,getSingleReview,updateReview,deleteReview,getSingleProductReviews
}