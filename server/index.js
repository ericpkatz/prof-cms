const path = require('path')
const express = require('express')
const morgan = require('morgan')
const compression = require('compression')
const db = require('./db')
const PORT = process.env.PORT || 8080
const app = express()
const ejs = require('ejs');
module.exports = app



const createApp = () => {
  // logging middleware
  app.use(morgan('dev'))

  // body parsing middleware
  app.use(express.json())

  // compression middleware
  app.use(compression())

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
    console.error(err)
    console.error(err.stack)
    res.status(err.status || 500).send(err.message || 'Internal server error.')
  })
}

const startListening = () => {
  // start listening (and create a 'server' object representing our server)
  const server = app.listen(PORT, () =>
    console.log(`Mixing it up on port ${PORT}`)
  )

}

const syncDb = () => db.sync()

async function bootApp() {
  await syncDb()
  await createApp()
  await startListening()
}
// This evaluates as true when this file is run directly from the command line,
// i.e. when we say 'node server/index.js' (or 'nodemon server/index.js', or 'nodemon server', etc)
// It will evaluate false when this module is required by another module - for example,
// if we wanted to require our app in a test spec
if (require.main === module) {
  bootApp()
} else {
  createApp()
}
