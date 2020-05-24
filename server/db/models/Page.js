const Sequelize = require('sequelize')
const { STRING, BOOLEAN, UUID, UUIDV4, TEXT } = Sequelize;
const db = require('../db')

const Page = db.define('page', {
  id: {
    primaryKey: true,
    type: UUID,
    defaultValue: UUIDV4
  },
  title: {
    type: Sequelize.STRING
  },
  isHomePage: {
    type: BOOLEAN, 
    defaultValue: false
  },
  content: {
    type: TEXT
  }
}, {
  hooks: {
    beforeDestroy: async function(page){
      if(page.isHomePage){
        const error = Error('can not destroy home page');
        throw error;
      }
      const children = await Page.count({
        where: {
          parentId: page.id
        }
      });
      if(children){
        const error = Error('can not destroy pages with children');
        throw error;
      }
    }
  }
})

Page.getHomePage = function(){
  return this.findOne({ where: {isHomePage: true} })
    .then( (page) => {
      if(page){
        return page;
      }
      return Page.create({ title: 'Home', isHomePage: true, content: 'The Home Page' })
    })
};

Page.belongsTo(Page, { as: 'parent' });
Page.hasMany(Page, { as: 'children', foreignKey: 'parentId'});

module.exports = Page

