const jwt = require('jsonwebtoken');

const adminAuthMiddleware = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const tokenWithoutBearer = token.substring(7); // Remove 'Bearer ' prefix
    try {
        const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_PASSWORD);
        console.log('Decoded token:', decoded); // Add this line for debugging
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'User is not authorized to access this resource' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Token verification error:', err); // Add this line for debugging
        return res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = adminAuthMiddleware;

