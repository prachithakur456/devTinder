const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://thakurprachi279:zi9jnOhy5rsOXOPB@cluster0.5rlowgn.mongodb.net/devTinder');
}

module.exports = connectDB;
