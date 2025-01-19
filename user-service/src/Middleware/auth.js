const jwt = require('jsonwebtoken');

// Replace this secret with your own securely stored secret key
const JWT_SECRET = process.env.secret

const authentication = (req, res, next) => {
  // Get the authorization header
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    // Extract the token from the header
    const token = authHeader.split(" ")[1];

    // Verify the token
    jwt.verify(token, JWT_SECRET, (err, user) => {
        console.log(err)
      if (err) {
        // Token is invalid or expired
        return res.status(403).json({ message: "Token is invalid or expired" });
      }
console.log( "ushubfbs",user)
      // Token is valid, set user details in request object
      req.user = user;
      next();
    });
  } else {
    // No token provided
    res.status(401).json({ message: "Authorization token is required" });
  }
};

module.exports = {authentication};
