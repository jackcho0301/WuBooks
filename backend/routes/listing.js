const express = require('express')

const router = express.Router()

const {createListing, getAllListingsByCurrentUser, getListing, deleteListing} = require('../controllers/listing')

router.route('/').post(createListing).get(getAllListingsByCurrentUser)
router.route('/:id').get(getListing).delete(deleteListing)
// .patch(updateListing);

module.exports = router