try {
  process.env = {...process.env, ...require('../secrets.js')}
}
catch(ex){
  console.log('no secrets file');
}
const db = require('./db')
const PORT = process.env.PORT || 8080
const app = require('./app'); 


db.syncAndSeed();


const server = app.listen(PORT, () =>
  console.log(`Mixing it up on port ${PORT}`)
)
