const express = require('express')

const router = express.Router()

const { getMyProfile, getOthersProfile} = require('../controllers/profile')

router.route('/').get(getMyProfile)
router.route('/search').get(getOthersProfile)

module.exports = router
