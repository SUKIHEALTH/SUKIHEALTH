const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  const token = req.cookies.authToken;  // Token from cookies

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verifying the token
    req.user = decoded;  // Attaching the decoded token to the request
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

