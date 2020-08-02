const Sequelize = require('sequelize')
const { VIRTUAL, STRING, BOOLEAN, UUID, UUIDV4, TEXT } = Sequelize;
const db = require('../db')

const Page = db.define('page', {
  id: {
    primaryKey: true,
    type: UUID,
    defaultValue: UUIDV4
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  isHomePage: {
    type: BOOLEAN, 
    defaultValue: false
  },
  imageData: {
    type: VIRTUAL
  },
  removeImage: {
    type: VIRTUAL
  },
  content: {
    type: TEXT
  }
}, {
  hooks: {
    beforeSave: async function(page){
      if(page.imageId === ''){
        page.imageId = null;
      }
      if(page.isHomePage && page.parentId){
        const error = Error('home page can not have a parent');
        throw error;
      }
      if(!page.isHomePage && !page.parentId){
        const error = Error('parent page is required');
        throw error;
      }
      if(page.imageData){
        page.imageId = (await db.models.image.upload(page.imageData, process.env.bucket)).id;
      }
      if(page.parentId === ''){
        page.parentId = null;
      }
      if(page.removeImage){
        page.imageId = null;
      }
    },
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

