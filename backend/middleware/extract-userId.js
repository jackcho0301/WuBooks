const User = require('../models/User');
// const jwt = require('jsonwebtoken');
const {UnauthenticatedError} = require('../errors');

const extractUserId = async (req, res, next) => {

    const {userId} = req.session
    if (userId) {
        
        const user = await User.findById(userId)
        if (!user) {
            throw new UnauthenticatedError('Invalid credentials');
        }

        //req.user passed down to portfolio routes
        req.user = {userId : userId, username: user.username};
        next()
    }
    else {
        //not logged in
        throw new UnauthenticatedError('authentication invalid');
    }
}


module.exports = extractUserId;