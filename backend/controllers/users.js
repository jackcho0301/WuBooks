const User = require('../models/User')

const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors');


const getAllUsers = async (req, res) => {
    const users = await User.find({})
        .sort('createdAt')
        .select('username')
    res.status(StatusCodes.OK).json({users, count: users.length});
}


module.exports = { 
    getAllUsers, 
}