const express = require('express');
const cors = require('cors');
const app = express();
const port = 9000;
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const authenticateJWT = require('./authMiddleware');
const authRoutes = require('./authroutes');

app.use('/protected', authenticateJWT);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the home page');
});

app.listen(port, () => {
  console.log(`Server is started on port ${port}`);
});
