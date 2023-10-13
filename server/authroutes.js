const express = require('express');
const jwt = require('jsonwebtoken');

const secretKey = 'This is my secret key';

const router = express.Router();

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === 'user' && password === 'password') {
      const user = { username };
      const token = jwt.sign(user, secretKey);
      res.json({ status: 200, token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
  

module.exports = router;
