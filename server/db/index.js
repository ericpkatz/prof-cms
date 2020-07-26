const db = require('./db')

// register models
const models = require('./models')

const { User, Page, Image } = models;

Page.belongsTo(Image);
Image.hasMany(Page);

const syncAndSeed = async()=> {
  await db.sync({ force: true });
  const User = models.User;
  let _users = [
    User.create({
    email: 'moe@email.com',
    password: 'MOE'
    }), 
    User.create({
      email: 'lucy@email.com',
      password: 'LUCY'
    })
  ];
  if(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD){
    _users = [
      User.create({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      })
    ]
  }
  const users = await Promise.all(_users);

  return users.reduce((acc, user)=> {
    acc[user.email] = user;
    return acc;
  }, {});
};

module.exports = {
  db,
  syncAndSeed,
  models
} 
