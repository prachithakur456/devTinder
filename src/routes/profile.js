const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require('../middleware/auth');
const {validateEditProfile} = require('../utils/validation');

profileRouter.get('/profile/view', userAuth, async(req, res) => {
    try{
        res.send(req.user);
    }catch(err){
        res.status(401).send(err.message);
    }
});

profileRouter.patch('/profile/edit', userAuth, async(req, res) => {
    try{
    if(!validateEditProfile(req)){
        throw new Error("Invalid profile details");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach(field => loggedInUser[field] = req.body[field]);
    await loggedInUser.save();
    res.json({
        message: "Data updated successfully",
        data: loggedInUser
    })
    }catch(err){
        res.status(401).send("Error: " + err.message);
    }
});

profileRouter.patch('/profile/password', userAuth, async(req, res) => {

})

module.exports = profileRouter;