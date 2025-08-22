import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { config } from '../config/environment.js';
import { ResponseBuilder } from '../utils/response.js';
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            const response = ResponseBuilder.unauthorized('Access token required', req);
            return res.status(401).json(response);
        }
        const decoded = jwt.verify(token, config.JWT_SECRET);
        // Find admin and check if still active
        const admin = await Admin.findById(decoded.adminId).select('-password');
        if (!admin || !admin.isActive) {
            const response = ResponseBuilder.unauthorized('Invalid or inactive admin account', req);
            return res.status(401).json(response);
        }
        req.admin = admin;
        next();
    }
    catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            const response = ResponseBuilder.unauthorized('Invalid token', req);
            return res.status(403).json(response);
        }
        if (error instanceof jwt.TokenExpiredError) {
            const response = ResponseBuilder.unauthorized('Token expired', req);
            return res.status(401).json(response);
        }
        const response = ResponseBuilder.internalError('Authentication error', req);
        return res.status(500).json(response);
    }
};
//# sourceMappingURL=auth.js.map