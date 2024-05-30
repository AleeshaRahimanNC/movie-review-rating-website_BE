// Importing JWT Module
const jwt = require('jsonwebtoken');

const adminAuthMiddleware = (req, res, next) => {
    // Middleware function logic
    // Below const shows the Token Extraction
    const token = req.header('Authorization');  

    // Token Validation
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // Token Verification
    const tokenWithoutBearer = token.substring(7); // Remove 'Bearer ' prefix
    try {
        const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_PASSWORD);
        console.log('Decoded token:', decoded); // Add this line for debugging

        // Authorization Check
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'User is not authorized to access this resource' });
        }
        
        // Setting User Object in Request
        req.user = decoded;
        // Calling Next Middleware Function
        next();
    } catch (err) {
        console.error('Token verification error:', err); // Add this line for debugging
        return res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = adminAuthMiddleware;

