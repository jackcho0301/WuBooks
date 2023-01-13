
const User = require('../models/User')
// const ProfilePic = require('../models/ProfilePic')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError, NotFoundError} = require('../errors');
const multer = require('multer')
const fs = require('fs')
const path = require('path');
const { readdir } = require('fs/promises');


let currentData = readPrices()
const Portfolio = require('../models/Portfolio')
const NodeCache = require('node-cache');


const getMyProfile = async (req, res) => {

    const userId = req.user.userId
    const user = await User.findOne({ _id: userId });
    if (!user) {
        throw new NotFoundError(`No user with id ${userId}`);
    }

    const username = user.username


    const dir = path.join(__dirname, '..', 'uploads');
    const name = userId.toString()

    const matchedFiles = [];
    const files = await readdir(dir);
    for (const file of files) {
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

    currentData = readPrices()

    const {rankCollection} = await getRankings(req,res)

    const rankObject = rankCollection.find(element => element.userName === username);
    const score = rankObject.score
    
    let rank = 1
    let prevScore = rankCollection[0].score
    let count = 0
    for (let i = 0; i < rankCollection.length; i++) {
        
        count ++
        if (rankCollection[i].score < prevScore){

            rank = count

            prevScore = rankCollection[i].score
        }
        if (rankCollection[i].userName === username){
            break
        }
    }

    res.status(200).json({username: username, score: score, rank: rank, rankTotal: rankCollection.length, profilePicPath})
    
}


const getOthersProfile = async (req, res) => {

    const username = req.query.username
    const user = await User.findOne({ username: username });
    if (!user) {
        throw new NotFoundError(`No user with username ${username}`);
    }

    const userId = user._id
    // console.log(userId)




    const dir = path.join(__dirname, '..', 'uploads');
    // console.log(dir)
    const name = userId.toString()

    const matchedFiles = [];
    const files = await readdir(dir);
    for (const file of files) {

        const filename = path.parse(file).name;

        if (filename === name) {
            matchedFiles.push(file);
        }
    }

    let profilePicPath = ""

    if (matchedFiles.length == 0) {
        profilePicPath = req.protocol + '://' + req.get('host') + "/default.png"
    }
    else {
        // profilePicPath = path.join(__dirname, '..', 'uploads', matchedFiles[0])
        profilePicPath = req.protocol + '://' + req.get('host') + "/" + matchedFiles[0]
    }


    const {rankCollection} = await getRankings(req,res)


    const rankObject = rankCollection.find(element => element.userName === username);
    const score = rankObject.score
    
    let rank = 1
    let prevScore = rankCollection[0].score
    let count = 0
    for (let i = 0; i < rankCollection.length; i++) {
        
        count ++
        if (rankCollection[i].score < prevScore){
            rank = count
            prevScore = rankCollection[i].score
        }

        if (rankCollection[i].userName === username){
            break
        }
    }

    
    res.status(200).json({username: username, score: score, rank: rank, profilePicPath})

    
}


const getRankings = async (req, res) => {
    const portfolioInfo = await Portfolio.find();
    const userInfo = await User.find();

    let rankCollection = []

    for (var i = 0; i < userInfo.length; i++)
    {
        let currInfo = []

        let portInfo = retrievePortInfoKernel(userInfo[i]._id, userInfo[i].prefPort, portfolioInfo)
        currInfo = retrieveCurrInfoKernel(userInfo[i]._id, userInfo[i].prefPort, portfolioInfo)
        totalValueScore = totalValueKernel(userInfo[i]._id, userInfo[i].prefPort, portfolioInfo, currInfo)
        rankItem = ({userName:userInfo[i].username,score:totalValueScore})
        rankCollection.push(rankItem)
    }
    if (rankCollection){
        rankCollection.sort((a,b) => b.score - a.score)
        return {success: true, rankCollection: rankCollection}
        // res.status(200).json({success:true, data:rankCollection})
    }
    else
    {
        return {success: false}
        // res.status(400).json({success:false, msg:'Error while getting leaderboard'})
    }
}



// This method will retrieve the portfolio information for an individual user/
// portfolio combination, represented by integer IDs. It will return a collection
// of items with the properties: "userID", "portID", "stockName", "numOfUnits",
// and "initCost". Each of these items represents a stock purchase in their 
// portfolio. "stockName" is the ticker string of the stock. "numOfUnits" is the 
// number of stocks that they own of that stock. "initCost" represents the price
// they initially paid for that stock.
function retrievePortInfoKernel(userID, portID, portfolioInfo){
    let portInfo  = portfolioInfo;

    portInfo = portInfo.filter((infoItem) => {
        if ((String(infoItem.userId) === String(userID)) & (Number(infoItem.portId) == Number(portID))){
            const {stockName, numOfUnits, initCost} = infoItem
            return {stockName, numOfUnits, initCost}
        }
    })

    return portInfo
}

// NOTE: This method is retained only for reference now.
// This method will retrieve the current info based on an individual user/
// portfolio combination, represented by integer IDs. It does not actually return
// anything from the portfolio directly. Rather, it takes the stockName values
// from the user's portfolio, accesses the same name from the stock API (ideally),
// and returns the current price.
function retrieveCurrInfoKernel(userID, portID, portfolioInfo){
    let currInfo = [...currentData]

    const portInfo = retrievePortInfoKernel(userID, portID, portfolioInfo)

    currInfo = currInfo.filter((infoItem) => {
        for (pI of portInfo){
            if (pI.stockName === infoItem.stockName){
                return infoItem
            }
        }
    })

    return currInfo
}



// This method will return the individual value of each stock the
// user currently owns in a particular portfolio. It is designed to
// be used with generating that pie chart on that one window.
function stockReturnKernel(userID, portID, portfolioInfo, currInfo){
    const portInfo = retrievePortInfoKernel(userID, portID, portfolioInfo)
    //const currInfo = retrieveCurrInfoKernel(userID, portID, portfolioInfo)

    let returnCollection = []
    for (pI of portInfo){
        // Should only ever return one item
        currentItem = currentData.filter((infoItem) => {
            if (pI.stockName === infoItem.stockName){
                return infoItem
            }
        })

        indivReturn = (pI.numOfUnits * currentItem[0].currentCost)
        returnItem = ({stockName:pI.stockName,return:indivReturn})
        returnCollection.push(returnItem)
    }

    return returnCollection
}




// This method returns the total monetary value of a portfolio, and is
// the primary measure by which we will score users as it should be 
// guaranteed to be non-negative.
function totalValueKernel(userID, portID, portfolioInfo, currInfo){
    const stockReturn = stockReturnKernel(userID, portID, portfolioInfo, currInfo)

    let sumValue = 0
    for (returnItem of stockReturn){
        sumValue += returnItem.return
    }

    return sumValue
}

function readPrices() {
    let fdata

    try {
	fdata = fs.readFileSync('storedPrices.js', {encoding:'utf8',flag:'r'})
    } catch (error) {
	console.error(error)
    }

    data = JSON.parse(fdata.toString())

    return data
}

module.exports = { 
    getMyProfile,
    getOthersProfile,
}
