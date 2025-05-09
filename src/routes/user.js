const express = require('express');
const { userAuth } = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const userRouter = express.Router();

userRouter.get('/user/request/received', userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequestData = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate("fromUserId", "firstName lastName age gender desc photoUrl");
        console.log("request received", connectionRequestData, loggedInUser)
        return res.status(200).json({data: connectionRequestData});
    }catch(err){
        res.status(400).send("Error "+err.message);
    }
});

userRouter.get('/user/connection', userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequestData = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id, status: 'accepted'},
                {fromUserId: loggedInUser._id, status: 'accepted'}
            ]
        }).populate("fromUserId", "firstName lastName age gender desc photoUrl")
        .populate("toUserId", "firstName lastName age gender desc photoUrl");
        console.log("connectionRequest", connectionRequestData);
        const data = connectionRequestData.map(item => {
            if(item.toUserId._id.toString() === loggedInUser._id.toString()){
                return item.fromUserId;
            }
            return item.toUserId;
        })
        return res.status(200).json({data: data});
    }catch(err){
        res.status(400).send("Error "+err.message);
    }
});

userRouter.get('/feed', userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page-1)*limit;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id, fromUserId: loggedInUser._id
        }).select("firstName lastName");

        const hideUsers = new Set();
        connectionRequest.forEach(item => {
            hideUsers.add(item.fromUserId.toString());
            hideUsers.add(item.toUserId.toString());
        })
        const users = await User.find({
            $and: [
                {_id: {$nin: Array.from(hideUsers)}},
                { _id: {$ne: loggedInUser._id}}
            ]
        })
        .select("firstName lastName age gender desc photoUrl")
        .skip(skip)
        .limit(limit);
        return res.status(200).json({data: users});
    }catch(err){
        res.status(400).send("Error: "+err.message);
    }
    });

module.exports = userRouter;