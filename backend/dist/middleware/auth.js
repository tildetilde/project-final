import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { config } from '../config/environment.js';
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            return res.status(401).json({ success: false, error: 'Access token required' });
        }
        const decoded = jwt.verify(token, config.JWT_SECRET);
        // Find admin and check if still active
        const admin = await Admin.findById(decoded.adminId).select('-password');
        if (!admin || !admin.isActive) {
            return res.status(401).json({ success: false, error: 'Invalid or inactive admin account' });
        }
        req.admin = admin;
        next();
    }
    catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({ success: false, error: 'Invalid token' });
        }
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ success: false, error: 'Token expired' });
        }
        return res.status(500).json({ success: false, error: 'Authentication error' });
    }
};
