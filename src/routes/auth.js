const express = require('express');
const bcrypt = require('bcrypt');

const authRouter = express.Router();
const {validateUser} = require('../utils/validation');
const User = require('../models/user');

authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("invalid user");
        }
        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        } else {
            const token = await user.getJWT();
            res.cookie('token', token);
            res.json({message: 'Login Successful', data: user})
        }
    }
    catch (err) {
        res.status(400).send("Err" + err.message);
    }
});

authRouter.post('/signUp', async (req, res) => {
    try {
        validateUser(req);
        const { firstName, lastName, email, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName, lastName, email, password: passwordHash
        });
        const data = await user.save();
        const token = await user.getJWT();
        res.cookie('token', token);
        res.json({message: "USer added successfully", data});
    }
    catch (err) {
        res.status(400).send('Error saving the user' + err);
    }
});

authRouter.post('/logout', async (req, res) => {
    res.cookie('token', null);
    res.status(200).send('Logout successful');
})

module.exports = authRouter;