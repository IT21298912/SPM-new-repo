const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    googleid: {
        type: String,
        maxlength: 50
    },
    firstname: {
        type: String,
        required: true,
        maxlength: 50
    },
    lastname: {
        type: String,
        required: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        maxlength: 50,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'] // Email validation with regex
    },
    age: {
        type: String,
        maxlength: 50
    },
    dob: {
        type: String,
        maxlength: 50
    },
    password: {
        type: String,
        maxlength: 50
    },
    role: {
        type: String,
        required: true,
        maxlength: 50
    }
}, {
    timestamps: true
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
