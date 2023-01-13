
const User = require('../models/User')
// const ProfilePic = require('../models/ProfilePic')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors');
const multer = require('multer')

const fs = require('fs')
const path = require('path');
const { readdir } = require('fs/promises');



const updateProfilePic = async (req, res) => {

    const Storage = multer.diskStorage({
        destination: 'uploads',
        filename: (req, file, callback) => {
            callback(null, req.user.userId + ".png")
        }
    })
    
    const upload = multer({
        storage: Storage
    }).single('profilePicture')

    const userId = req.user.userId
    const username = req.user.username


    upload(req, res, (err) => {
        if (err) {
            throw new BadRequestError('Unable to upload image');
        }
        else {
            
            res.status(StatusCodes.CREATED).json({msg: "profile picture UPDATE successful"})
        }
    })

    
}


const deleteProfilePic = (req, res) => {

    const userId = req.user.userId

    const dir = path.join(__dirname, '..', 'uploads', userId + '.png');

    fs.unlink(dir, (err) => {
        if (err) {
            return res.status(404).json({msg: "profile picture is already default"})
        }
        else {
            return res.status(200).json({msg: "profile picture successfully deleted"})
        }
    })
   
}


const getProfilePic = async (req, res) => {
    const userId = req.user.userId

    const dir = path.join(__dirname, '..', 'uploads');
    console.log(dir)
    const name = userId

    const matchedFiles = [];
    const files = await readdir(dir);
    for (const file of files) {
        // Method 1:
        const filename = path.parse(file).name;
        if (filename === name) {
            matchedFiles.push(file);
        }
    }

 

    let profilePicPath = ""

    if (matchedFiles.length == 0) {
        // profilePicPath =  path.join(__dirname, '..', 'uploads', 'default', 'default.png')
        profilePicPath = req.protocol + '://' + req.get('host') + "/default.png"
    }
    else {
        // profilePicPath = path.join(__dirname, '..', 'uploads', matchedFiles[0])
        profilePicPath = req.protocol + '://' + req.get('host') + "/" + req.user.userId + ".png"
    }


    res.json({path: profilePicPath})
    // if (matchedFiles.length == 0) {
    //     res.json({path: path.join(__dirname, '..', 'uploads', 'default', 'default.png')})
    // }
    // else {
    //     res.json({path: path.join(__dirname, '..', 'uploads', matchedFiles[0])})
    // }

}



module.exports = { 
//    uploadProfilePic,
   deleteProfilePic,
   updateProfilePic,
   getProfilePic
}