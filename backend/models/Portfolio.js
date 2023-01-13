const mongoose = require('mongoose')

const PortfolioSchema = new mongoose.Schema( {
    
    /*
    userID: 1,
    portID: 1,
    stockName: 'TSLA',
    numOfUnits: '100',
    initCost: 312.34
    */
   
   userId: {
       type: mongoose.Types.ObjectId,
       ref: 'User',
       required: [true, 'Please provide user']
   },

   portId: {
    type: Number,
    enum: [1,2,3,4],
    required: [true, 'Please provide portfolio ID']
   },

   stockName : {
       type: String,
        required: [true, 'Please provide stock ticker name'],
        minlength: 1,
        maxlength: 10,
    },

    numOfUnits: {
        type: Number,
        required: [true, 'Please provide number of stock units'],
        minlength: 1,
    },
    
    initCost: {
        type: Number,
        required: [true, 'Please provide initial cost']
    },

})



module.exports = mongoose.model('Portfolio', PortfolioSchema)



