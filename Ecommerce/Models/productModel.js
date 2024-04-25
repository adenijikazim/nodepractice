const mongoose = require('mongoose')
const productSchema =new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true, 'please provide product name'],
        maxlength:[100, 'name cannot be more than 100 characters']
    },
    price:{
        type:Number,
        required:true,
        default:0
    }, 
    description:{
        type:String,
        trim:true,
        required:[true, 'please provide product description'],
        maxlength:[1000, 'name cannot be more than 1000 characters']
    },
    image:{
        type:String,
        default:'/uploads/examples.jpg'
    },
    category:{
        type:String,
        enum:['bedroom', 'kitchen','office', ]
    },
    company:{
        type:String,
        enum:{
            values:['ikea', 'liddy', 'marcos'],
            message:'{VALUES} is not supported'
        }

       },
    colors:{
        type:[String],
        default:['#222'],
        required:true
    },
    featured:{
        type:Boolean,
        default:false
    },
    freeShipping:{
        type:Boolean,
        default:false
    },
    inventory:{
        type:Number,
        required:true,
        default:15
    },
    averageRating:{
        type:Number,
        default:0
    },
    NumOfReviews:{
        type:Number,
        default:0
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true
    }

},{timestamps:true, toJSON:{virtuals:true}, toObject:{virtuals:true}})

productSchema.virtual('reviews',{
    ref:'Review',
    localField:'_id',
    foreignField:'product',
    justOne:false
})

productSchema.pre('remove', async function(next){
    await this.model('Review').deleteMany({product:this._id}) 
})
module.exports = mongoose.model('Product', productSchema)