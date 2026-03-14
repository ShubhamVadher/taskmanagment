const jwt = require('jsonwebtoken');
const KEY = process.env.ADMINKEY;

const isAdmin = (req, res, next) => {
  try {
    const token = req.cookies.AdminToken;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No admin token found' });
    }

    const decoded = jwt.verify(token, KEY);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Not an admin' });
    }

    req.admin = decoded;
    next();

  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};

module.exports = isAdmin;