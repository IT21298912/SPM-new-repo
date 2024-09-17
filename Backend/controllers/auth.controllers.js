const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = require('../config');
// const { check, validationResult } = require('express-validator');

// Using environment variables
require('dotenv').config();

const register = async (req, res) => {
    const { firstname, lastname, email, age, dob, password, role } = req.body;

    // Input validation
    if (!firstname || !lastname || !email || !password || !role) {
        return res.status(400).json({ message: 'Please fill all required fields' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password with higher salt rounds
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({ firstname, lastname, email, age, dob, password: hashedPassword, role });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = generateToken(user);

        const role = user.role;
        res.json({ token, role });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};


//token validation
const generateToken = (user) => {
    const payload = {
        userId: user._id,
        role: user.role,
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const getDetails = async (req, res) => {
    const { userId } = req.body;

    try {
        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { firstname, lastname, email, age, dob, role } = user;

        res.json({ firstname, lastname, email, age, dob, role });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

const updateUser = async (req, res) => {
    const { userId, firstname, lastname, age, dob } = req.body;

    try {
        const result = await User.findByIdAndUpdate(userId, { firstname, lastname, age, dob }, { new: true });

        if (result) {
            return res.status(200).json({ message: 'User updated successfully', success: true });
        }

        res.status(404).json({ message: 'User not found', success: false });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', success: false });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const result = await User.findByIdAndDelete(userId);

        if (result) {
            return res.status(200).json({ message: 'User deleted successfully', success: true });
        }

        res.status(404).json({ message: 'User not found', success: false });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong', success: false });
    }
};

const checkOldPassword = async (req, res) => {
    const { email, password, oldPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid old password' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await User.findByIdAndUpdate(user._id, { password: hashedPassword });

        if (result) {
            res.json({ pass: true });
        } else {
            res.json({ pass: false });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

//sensitive data
let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendVerificationKey = async (req, res) => {
    const { email, key } = req.body;

    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verification Code',
            text: `Dear User, your verification code is ${key}.`
        };

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email' });
        } else {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            res.json({ Digits: key });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

const changePassword = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await User.findByIdAndUpdate(user._id, { password: hashedPassword });

        if (result) {
            res.json({ changed: true });
        } else {
            res.json({ changed: false });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error fetching users' });
    }
};

module.exports = {
    register,
    login,
    getDetails,
    updateUser,
    deleteUser,
    checkOldPassword,
    sendVerificationKey,
    changePassword,
    getUsers
};
