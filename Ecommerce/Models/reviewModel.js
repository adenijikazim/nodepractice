const mongoose = require('mongoose')
const reviewSchema =new mongoose.Schema({
    rating:{
        type:Number,
        min:1,
        max:5,
        required:[true, 'please enter rating']
    },
    title:{
        type:String,
        required:[true, 'please provide review title'],
        trim:true,
        maxlength:100
    },
    comment:{
        type:String,
        required:[true, 'please provide review text']
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    }

},{timestamps:true})

reviewSchema.index({user:1, product:1}, {unique:true})

reviewSchema.statics.calculateAverageRating = async function(){

}

reviewSchema.post('save', async function(){
    await this.constructor.calculateAverageRating(this.product)
})

reviewSchema.post('remove', async function(){
    await this.constructor.calculateAverageRating(this.product)

})


module.exports = mongoose.model('Review', reviewSchema)