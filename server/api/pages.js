const router = require('express').Router()
const {Page } = require('../db/models')
module.exports = router

router.get('/:id?', (req, res, next) => {
  if(!req.params.id){
    Page.getHomePage()
      .then( page => res.send(page))
      .catch(next);
  }
  else {
    Page.findByPk(req.params.id)
      .then( page => res.send(page))
      .catch(next);
  }
})
