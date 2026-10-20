// Authentication and Role Authorization Middleware
import jwt from 'jsonwebtoken';
import { dbStore } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'shebora_dhaka_secure_jwt_secret_2026';

export function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in.'
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = dbStore.getUserById(decoded.id) || dbStore.getUserByEmail(decoded.email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account not found or has been revoked.'
      });
    }
    // Safe user object on request (never expose passwordHash)
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      address: user.address,
      avatar: user.avatar
    };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session token. Please log in again.'
    });
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = dbStore.getUserById(decoded.id) || dbStore.getUserByEmail(decoded.email);
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
          address: user.address,
          avatar: user.avatar
        };
      }
    } catch {
      // Ignore token error in optional auth
    }
  }
  next();
}

export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to ${allowedRoles.join(', ')} accounts.`
      });
    }

    next();
  };
}
