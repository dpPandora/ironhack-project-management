// #/routes/auth.routes.js

const Express = require('express');
const router = Express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { isAuth } = require('../middleware/jwt.middleware.js')

const User = require('../models/User.model');

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({message: "error with username and password", error: "the username and password cannot be empty"})
    return;
  }

  User
    .findOne({username: username})
    .then(foundUser => {
      if (foundUser) {
        console.log(foundUser);
        res.status(400).json({error: "username taken"});
        return;
      }

      return User.create({
        username,
        password: bcrypt.hashSync(password)
      })
    })
    .then(createdUser => {
      if(!createdUser) return;
      console.log(createdUser);
      res.status(201).json({message: "user created successfully", user: createdUser.username});
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({message: "an error has occured", error: err});
    })
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({message: "error with username and password", error: "the username and password cannot be empty"})
    return;
  }

  User
    .findOne({username: username})
    .then(foundUser => {
      if (!foundUser) {
        res.status(400).json({error: "invalid username or password"});
        return;
      }

      const isValidPassword = bcrypt.compareSync(password, foundUser.password)

      if(!isValidPassword) {
        res.status(400).json({error: "invalid username or password"});
        return;
      };

      const payload = {
        username: foundUser.username,
        id: foundUser._id
      }

      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: '6h'
      })

      res.status(200).json({message: "success", authToken: authToken});
    })
    .catch(err => {
      res.status(500).json({message: "an error has occured", error: err});
    })
});

router.get('/verify', isAuth, (req, res, next) => {
  console.log("token payload", req.payload);

  res.status(200).json(req.payload);
});

module.exports = router;