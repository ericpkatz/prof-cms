const router = require('express').Router()
const { Image, Page } = require('../db/models')
const { isLoggedIn } = require('./middleware');
module.exports = router

const include = [
  {
    model: Image
  }
];

router.delete('/:id', isLoggedIn, (req, res, next) => {
  Page.findByPk(req.params.id)
    .then( page => page.destroy())
    .then(()=> res.sendStatus(204))
    .catch(next);
});

router.get('/', async(req, res, next) => {
  try {
    const pages = await Page.findAll({ include });
    if(!pages.length){
      res.send([ await Page.getHomePage()]);
    }
    else {
      res.send(pages);
    }
  }
  catch(ex){
    next(ex);
  }
});

router.post('/', isLoggedIn, (req, res, next)=> {
  Page.create(req.body)
    .then(page => {
      return Page.findByPk(page.id, { include });
    })
    .then( page => res.send(page))
    .catch(next)
});

router.put('/:id', isLoggedIn, (req, res, next)=> {
  Page.findByPk(req.params.id)
    .then( page => {
      return page.update(req.body);
    })
    .then(page => {
      return Page.findByPk(page.id, { include });
    })
    .then( page => res.send(page))
    .catch(next)
});
