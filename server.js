const dotenv = require('dotenv');

const { app } = require('./app');
const { initModels } = require('./models/initModels');
const { db } = require('./utils/db.utils');
dotenv.config({ path: './config.env' });

//server auth
db.authenticate()
  .then(() => {
    console.log('db auth');
  })
  .catch((e) => console.log(e));

//Models relations
initModels();

//server sync
db.sync()
  .then(() => {
    console.log('db sync');
  })
  .catch((e) => console.log(e));

app.listen(process.env.PORT, () => {
  console.log('Server On');
});
