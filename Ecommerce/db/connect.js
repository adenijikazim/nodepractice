const mongoose = require('mongoose')


const connectDB = async()=>{
  try {mongoose.connect(process.env.MONGO_URI),
    console.log('db connected success!')
  } catch (error) {
    console.log('db failed to connect')
  }
}

module.exports = connectDB
