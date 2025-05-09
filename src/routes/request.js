const express = require('express');
const requestRouter = express.Router();
const {userAuth} = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

requestRouter.post('/request/send/:status/:toUserId', userAuth, async(req, res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).send('User not found');
        }
        if(toUserId.toString() === fromUserId.toString()){
            return res.status(404).send('Cannot send connection request to yourself');
        }
        const allowedStatus = ['interested', 'ignored'];
        if(!allowedStatus.includes(status)){
            throw new Error('Invalid staus');
        }

        const existingConnection = await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
        ]
        })
        console.log(fromUserId, toUserId)
        if(existingConnection){
            throw new Error('Request Already exists');
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        const data = await connectionRequest.save();
        return res.json({
            message: "Request send successfully",
            data
        })
    }catch(err){
        res.status(401).send(err.message);
    }
});

requestRouter.post('/request/review/:status/:requestId', userAuth, async(req, res) => {
const loggedInUser = req.user;
const {status, requestId} = req.params;

try{
const allowedStatus = ['accepted', 'rejected'];
if(!allowedStatus.includes(status)){
    return res.status(400).json({message: 'Invalid status'});
}

const connectionRequest = await ConnectionRequest.findOne({
    _id: requestId,
    toUserId: loggedInUser,
    status: 'interested'
});
console.log("prachi.thakur@gmail.com", connectionRequest)
if(!connectionRequest){
    return res.status(400).json({message: "Connection Request was not found"});
}

connectionRequest.status = status;
const data = await connectionRequest.save();
return res.status(200).json({message: 'Connection request updated successfully', data});
}catch(err){
    console.log("errrrr", err.message)
    return res.status(401).send("Error" + err.message);
}
});

module.exports = requestRouter;