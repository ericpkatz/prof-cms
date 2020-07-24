const db = require('./db')

// register models
const models = require('./models')

const syncAndSeed = async()=> {
  await db.sync({ force: true });
  const User = models.User;
  const users = await Promise.all([
    User.create({
    email: 'moe@email.com',
    password: 'MOE'
    }), 
    User.create({
      email: 'lucy@email.com',
      password: 'LUCY'
    })
  ]);

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
