const router = require('express').Router()
module.exports = router

router.use('/pages', require('./pages'))
router.use('/auth', require('./auth'))
