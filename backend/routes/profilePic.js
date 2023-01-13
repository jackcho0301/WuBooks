const express = require('express')

const router = express.Router()

const { deleteProfilePic, updateProfilePic, getProfilePic} = require('../controllers/profilePic')

router.route('/').delete(deleteProfilePic).post(updateProfilePic).get(getProfilePic)

module.exports = router
