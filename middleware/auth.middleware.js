const jwt = require('jsonwebtoken');
const config = require('../config');
require('dotenv').config();
//role base authorization and token validation
const authenticate = (roles = []) => {
    return (req, res, next) => {
        const authHeader = req.header('Authorization');
        const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Forbidden: Insufficient role' });
            }
            next();
        } catch (error) {
            console.error('Authentication error:', error);
            res.status(401).json({ message: 'Token is not valid' });
        }
    };
};
const googleAuthenticate = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).json({ message: 'Google authentication failed' });
    }
};

module.exports = {
    authenticate,
    googleAuthenticate
};
