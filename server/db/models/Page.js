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
})

Page.getHomePage = function(){
  const include = [
    {
      model: Page,
      as: 'children'
    },
    {
      model: Page,
      as: 'parent'
    }
  ];
  return this.findOne({ include, where: {isHomePage: true} })
    .then( async (page) => {
      if(page){
        return page;
      }
      page = await Page.create({ title: 'Home', isHomePage: true, content: 'The Home Page' })
      return page.findByPk(page.id, { include });
    })
};

Page.belongsTo(Page, { as: 'parent' });
Page.hasMany(Page, { as: 'children', foreignKey: 'parentId'});

module.exports = Page

