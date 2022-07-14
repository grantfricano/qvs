const express = require('express');
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const compression = require('compression')

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path')
const User = require('./models/userModel')
const routes = require('./routes/route.js');
const cors = require('cors');

require("dotenv").config({
  path: path.join(__dirname, "../.env")
});

const app = express();

app.use(cors());
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(bodyParser.json())

const PORT = process.env.PORT || 3001;

mongoose.connect('mongodb://localhost:27017/rbac', { useNewUrlParser: true }).then(() => {
  console.log('Connected to the Database successfully')
});

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.use(async (req, res, next) => {
  if (req.headers["x-access-token"]) {
    try {
      const accessToken = req.headers["x-access-token"];
      const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
      // If token has expired
      if (exp < Date.now().valueOf() / 1000) {
        return res.status(401).json({
          error: "JWT token has expired, please login to obtain a new one"
        });
      }
      res.locals.loggedInUser = await User.findById(userId);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

app.use('/test', routes);

app.use((err, req, res, next) => {
   console.error(err.stack)

   res.status(500).send('Something broke!')
})

app.listen(PORT, () => {
  console.log('Server is listening on Port:', PORT)
})
