const Listing = require('../models/listing');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, NotFoundError} = require('../errors');
const { json } = require('express');

const createListing = async (req, res) => {
    req.body.userId = req.user.userId;
    const listing  = await Listing.create(req.body)
    res.status(StatusCodes.CREATED).json({listing})
}

const getAllListingsByCurrentUser = async (req, res) => {
    const listings = await Listing.find({ userId: req.user.userId }).sort('createdAt')
    res.status(StatusCodes.OK).json({listings, count: listings.length})
}


// const updateListing = async (req, res) => {
//     const {
//         body: {listingTitle, description, status},
//         user: {userId}, 
//         params:{id: listingId}
//     } = req //nested destructuring
   
//     if (company === '' || position ==='') {
//         throw new BadRequestError('Company or Position fields cannot be empty');
//     }

//     const job  = await Job.findByIdAndUpdate({_id: jobId, createdBy: userId}, req.body, {new: true, runValidators: true} );
    
//     if (!job) {
//         throw new NotFoundError(`No job with id ${jobId}`);
//     }
//     res.status(StatusCodes.OK).json({ job });
// }


const getListing = async (req, res) => {
    const {
        user: {userId}, 
        params:{id: listingId}
    } = req //nested Destructuring

    const listing = await Listing.findOne({
        _id: listingId, 
        userId: userId
    });
    if (!listing) {
        throw new NotFoundError(`No listing with id ${listingId}`)
    }
    res.status(StatusCodes.OK).json({ listing })
} 

const deleteListing = async (req, res) => {
    const {
        user: {userId}, 
        params:{id: listingId}
    } = req;


    console.log("listingId : " + listingId)
    console.log("userId : " + userId)

    const listing = await Listing.findOneAndDelete({
        _id: listingId,
        userId: userId
    })

    console.log(listing)

    if (!listing) {
        throw new NotFoundError(`No listing with id ${listingId}`);
    }
    res.status(StatusCodes.OK).send("listing deleted");
}

module.exports = { 
    createListing,
    getAllListingsByCurrentUser,
    getListing,
    deleteListing,
}