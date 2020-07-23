const app = require('express').Router();
const { User } = require('../db').models;
const jwt = require('jwt-simple');

module.exports = app;

app.post('/', (req, res, next)=> {
  const { email, password } = req.body;
  User.findOne({
    where: { email } 
  })
  .then( async(user) => {
    if(!user){
      return next({ status: 401 });
    }

    const correctPassword = await user.correctPassword(password);
    if(!correctPassword){
      return next({ status: 401 });
    }

    const token = jwt.encode({id: user.id}, process.env.JWT_SECRET);
    res.send({ token });
  })
  .catch(next);
});

app.get('/', (req, res, next)=> {
  if(!req.user){
    return next({ status: 401 });
  }
  res.send(req.user);
});
