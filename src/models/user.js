const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secret = 'DevTinder@123';

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    lastName: {
        type: String
    },
    age: {
        type: Number
    },
    photoUrl: {
        type: String,
        default: 'https://images.app.goo.gl/bxtK9DBhjzuxppWv7'
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email");
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        default: "This is default value of user",
    },
    gender: {
        type: String,
        enum: {
            values: ["male", "female", "other"],
            message: `{VALUE} is not valid`
        }
    }
}, { timestamps: true })

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({ _id: user._id }, secret, {expiresIn: '7d'});
    return token;
};

userSchema.methods.validatePassword = async function(passwordInputByUser){
const user = this;
const isPasswordValid = await bcrypt.compare(passwordInputByUser, user.password);
return isPasswordValid;
};

const User = mongoose.model('User', userSchema);
module.exports = User;