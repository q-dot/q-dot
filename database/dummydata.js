const db = require('./index.js');
const dbQuery = require('../controller/index.js');


const addManager = () => {
  return db.Manager.findOrCreate({
    where: {
      username: 'johnny',
      passwordHash: 'a48af21cebc18c880a2b9c53dd8b3fab483e26ff2b7b77dd9def2afe8305ff44b17f1b8d58e6106bb49570e602fde2b960e0e420d53874b2d8626016bbd97f83',
      passwordSalt: '8b1269b13d1258b15af6c66f4f4d5cd9'//,
      // restaurantId: '1'
    }
  });
};

const dropDB = () => {
  return db.Queue.drop()
    .then(() => db.Customer.drop())
    .then(() => db.ManagerAudit.drop())
    .then(() => db.Restaurant.drop())
    .then(() => db.Manager.drop())
    .then(() => db.Manager.sync({force: true})) // manager needs to sync before restaurant for FK
    .then(() => db.Restaurant.sync({force: true}))
    .then(() => db.Customer.sync({force: true}))
    .then(() => db.Queue.sync({force: true}))
    .then(() => db.ManagerAudit.sync({force: true}))
    .then(() => addManager())
    .then(() => addRestaurants())
    .then(() => addToQueue());
};

module.exports = {
  addRestaurants: addRestaurants,
  addToQueue: addToQueue,
  addManager: addManager,
  dropDB: dropDB
};
