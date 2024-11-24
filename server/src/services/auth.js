import jwt from 'jsonwebtoken'; // Ensure `JwtPayload` is imported for clarity
import dotenv from 'dotenv';
dotenv.config();
// Middleware to authenticate token for GraphQL context
export const authMiddleware = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new Error('Authorization token required');
    }
    const token = authHeader.split(' ')[1]; // Bearer <token>
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
        throw new Error('JWT secret key not defined in environment variables');
    }
    try {
        // Verify and decode the token
        const user = jwt.verify(token, secretKey);
        return user; // Return user data to be added to context
    }
    catch (err) {
        console.error('Invalid token', err);
        throw new Error('Invalid or expired token');
    }
};
export const authenticateToken = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new Error('Authorization token required');
    }
    const token = authHeader.split(' ')[1]; // Bearer <token>
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
        throw new Error('JWT secret key not defined in environment variables');
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded; // Return decoded token payload
    }
    catch (err) {
        throw new Error('Invalid or expired token');
    }
};
// Function to sign a token for the user
export const signToken = (username, email, _id) => {
    const payload = { username, email, _id };
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
        throw new Error('JWT secret key not defined in environment variables');
    }
    // Token expires in 1 hour
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
