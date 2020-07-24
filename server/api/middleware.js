const isLoggedIn = (req, res, next)=> {
  if(!req.user){
    const error = new Error('not authorized');
    error.status = 401;
    return next(error);
  }
  next();
};
module.exports = {
  isLoggedIn
};
