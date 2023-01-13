const express = require('express')

const router = express.Router()

const {getAllListings} = require('../controllers/public')

router.route('/').get(getAllListings)

module.exports = router