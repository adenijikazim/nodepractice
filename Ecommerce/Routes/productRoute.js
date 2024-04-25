const express = require('express')
const { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct, uploadImage } = require('../controllers/productController')
const { authenticateUser, authorizePermission } = require('../controllers/auth')
const { getSingleProductReviews } = require('../controllers/reviewController')
const router = express.Router()

router.route('/')
.create(authenticateUser,authorizePermission, createProduct)
.get(authenticateUser, getAllProducts)

router.route('/uploadImage').post(authenticateUser,authorizePermission,uploadImage)

router.route('/:id')
.get(getSingleProduct)
.patch(authenticateUser,authorizePermission,updateProduct)
.delete(authenticateUser,authorizePermission, deleteProduct)

router.route('/:id/reviews').get(getSingleProductReviews)


module.exports = router