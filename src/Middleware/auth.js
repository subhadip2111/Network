const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.secret;

const authentication = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
      console.log(err);
      if (err) {
        return res.status(403).json({ message: 'Token is invalid or expired' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: 'Authorization token is required' });
  }
};

module.exports = { authentication };
