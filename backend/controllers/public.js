const Listing = require('../models/listing');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, NotFoundError} = require('../errors');


const getAllListings = async (req, res) => {
    const listings = await Listing.find({}).sort('createdAt');
    res.status(StatusCodes.OK).json({listings, count: listings.length});
}


module.exports = {
    getAllListings,
    
}