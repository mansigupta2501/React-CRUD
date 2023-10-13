const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const secretKey = 'This is my secret key';
console.log('Generated secret key:', secretKey);

function authenticateJWT(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.sendStatus(401); 
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403); 
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateJWT;
