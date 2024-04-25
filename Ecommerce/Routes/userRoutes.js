
const express = require('express')
const { getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword } = require('../controllers/user')
const { authenticateUser, authorizePermission} = require('../controllers/auth')
const router = express.Router()

router.route('/').get(authenticateUser,authorizePermission,getAllUsers)
// router.route('/').get(authenticateUser,authorizePermission('admin','lead-admin'),getAllUsers)
router.route('/showMe').get(authenticateUser,showCurrentUser)
router.route('/updateUser').patch(updateUser)
router.route('/updateUserPassword').patch(authenticateUser,updateUserPassword)
router.route('/:id').get(authenticateUser,getSingleUser)

module.exports = router