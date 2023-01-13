const mongoose = require('mongoose')


const ListingSchema = new mongoose.Schema( {
    listingTitle: {
        type: String,
        required: [true, "Please provide title for the listing"],
        maxlength: 60,
    },
    books: [
        {
            title: {
                type: String, 
                required: [true, "Please provide title for the book"],
                maxlength: 100,
            },
            edition: {
                type: Number, 
            },
            category: {
                type: String, 
                default: "N/A",
                maxlength: 50,
            },
            isbn: {
                type: String, 
                required: [true, "Please provide isbn for the book"],
                minlength: 13,
                maxlength: 13,
            },
            condition: {
                type: String, 
                enum: ['mint', 'good', 'acceptable'],
                required: [true, "Please provide condition"],
            },
            listPrice: {
                type: String, 
                default: "N/A"
            },
            offeredPrice: {
                type: Number, 
                required: [true, "Please provide offered price for the book"],
            },
        }
    ],
       userId: {
       type: mongoose.Types.ObjectId,
       ref: 'User',
       required: [true, 'Please provide user']
   },

    description: {
        type: String,
        required: [true, "Please provide description for the listing"],
    },

    status: {
        type: Boolean,
        default: true
    }

}, {timestamps: true})


module.exports = mongoose.model('Listing', ListingSchema)