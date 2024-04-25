const express = require('express')
const app = express()
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

const authRouter = require('./Routes/authRoutes')
const userRouter = require('./Routes/userRoutes')
const productRouter = require('./Routes/productRoute')
const reviewRouter = require('./Routes/reviewRoutes')

require('dotenv').config()
require('express-async-errors')

const NotFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')


app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

app.use(express.static('./public'))
app.use(fileUpload)

const connectDB = require('./db/connect')

// routers 
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/review', reviewRouter)




app.get('/', (req, res) => {
    res.send('Hello World!')
})

    app.use(NotFoundMiddleware)
    app.use(errorHandlerMiddleware)


connectDB()
const port = 5000 || process.env.PORT
app.listen(port, console.log(`server is listening on port ${port}`))
