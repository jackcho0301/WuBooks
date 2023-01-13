const User = require('../models/User');
// const jwt = require('jsonwebtoken');
const {UnauthenticatedError} = require('../errors');

const auth = (req, res, next) => {

    if (req.session.userId) {
        next()
    }
    else {
        throw new UnauthenticatedError('authentication invalid');
    }

}


module.exports = auth;