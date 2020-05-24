const router = require('express').Router()
const {Page } = require('../db/models')
module.exports = router

const include = [
  {
    model: Page,
    as: 'children',
    attributes: [
      'title', 'id'
    ]
  },
  {
    model: Page,
    as: 'parent',
    attributes: [
      'title', 'id', 'isHomePage'
    ]
  }
];

router.delete('/:id', (req, res, next) => {
  Page.findByPk(req.params.id)
    .then( page => page.destroy())
    .then(()=> res.sendStatus(204))
    .catch(next);
});

router.get('/:id?', (req, res, next) => {
  if(!req.params.id){
    Page.getHomePage()
      .then( page => {
        return Page.findByPk(page.id, { include })
      })
      .then( page => res.send(page))
      .catch(next);
  }
  else {
    Page.findByPk(req.params.id, { include })
      .then( page => res.send(page))
      .catch(next);
  }
});

router.post('/', (req, res, next)=> {
  Page.create(req.body)
    .then(page => {
      return Page.findByPk(page.id, { include });
    })
    .then( page => res.send(page))
    .catch(next)
});
