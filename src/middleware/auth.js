const jwt = require('jsonwebtoken');
const User = require('../models/user');
const secret = 'DevTinder@123';

const userAuth = async (req, res, next)=> {
    try{
        const {token} = req.cookies || {};
    
        if(!token){
            throw new Error('Please login again!!!');
        }else {
            const decoded = await jwt.verify(token, secret);
            const id = decoded._id;
            const user = await User.findById(id);
            
            req.user = user;
            next();
        }
    }catch(err) {
        res.status(401).send("Token " + err.message);
    }
    
};

module.exports = {
    userAuth
}