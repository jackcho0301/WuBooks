const User = require('../models/User')
// const Portfolio = require('../models/Portfolio')

const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors');


const register = async (req, res) => {
    const user = await User.create({ ...req.body })
    res.status(StatusCodes.CREATED).json({msg: "register successful", username: user.username})
}


const login =  async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(StatusCodes.OK).json({msg: 'Please provide email and password'});
    }
    const user = await User.findOne({email});
    if (!user) {
        return res.status(StatusCodes.OK).json({msg: 'Invalid credentials'});
    }

    //compare password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        return res.status(StatusCodes.OK).json({msg: 'Invalid credentials'});
    }

    //save user id to req.session
    //will be passed down to authentication middleware
    req.session.userId = user.id

    res.status(StatusCodes.OK).json({msg: "login successful", email: user.email});


}


const logout = async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            throw err
        }
        res.clearCookie(process.env.SESSION_NAME)
        res.status(StatusCodes.OK).json({msg: "successful logout"});

    })
}



module.exports = { 
    register, 
    login,
    logout,
}
