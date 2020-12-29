const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be minimum 3 characters']
    },
    firstname: {
        type: String,
        required: [true, 'Please provide a first name'],
        trim: true,
        minlength: [2, 'First name must be minimum 2 characters']
    },
    lastname: {
        type: String,
        required: [true, 'Please provide a last name'],
        trim: true,
        minlength: [2, 'Last name must be minimum 2 characters']
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [5, 'Minimum password length is 5 characters']
    }


}, {
    timestamps: true,
})

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.statics.login = async function(email, password){
    const user = await this.findOne({ email });
    if (user){
        const auth = await bcrypt.compare(password, user.password);
        if (auth){
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
}

const User = mongoose.model('User', userSchema);

module.exports = User;