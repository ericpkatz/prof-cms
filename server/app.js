const path = require('path')
const express = require('express')
const morgan = require('morgan')
const compression = require('compression')
const db = require('./db')
const app = express()
const ejs = require('ejs');
const jwt = require('jwt-simple');
const { User } = db.models;

module.exports = app

// logging middleware
app.use(morgan('dev'))

// body parsing middleware
app.use(express.json({ limit: '50mb'}));

// compression middleware
app.use(compression())

app.use((req, res, next)=> {
  const token = req.headers.authorization;
  if(!token){
    return next();
  }
  let id;
  try{
    id = jwt.decode(token, process.env.JWT_SECRET).id;
  }
  catch(ex){
    return next(ex);
  }
  User.findByPk(id)
    .then( user => {
      req.user = user;
      next();
    })
    .catch(next);
});

app.engine('html', ejs.renderFile);


app.use('/api', require('./api'))

// static file-serving middleware
app.use('/public', express.static(path.join(__dirname, '..', 'public')))

app.get('/', (req, res) => {
  res.render(path.join(__dirname, '..', 'public/index.html'), {
    SITE_TITLE: process.env.SITE_TITLE || `PROF's CMS`
  })
})

// any remaining requests with an extension (.js, .css, etc.) send 404
app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error('Not found')
    err.status = 404
    next(err)
  } else {
    next()
  }
})

// sends index.html

// error handling endware
app.use((err, req, res, next) => {
  if(err.status !== 401){
    console.error(err)
    console.error(err.stack)
  }
  res.status(err.status || 500).send(err.message || 'Internal server error.')
})

