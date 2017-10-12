const db = require('./index.js');
const dbQuery = require('../controller/index.js');

const addToQueue = () => {
  return dbQuery.addToQueue({name: 'Tiffany', restaurantId: 1, size: 2, mobile: '4158475697'})
    .then(() => dbQuery.addToQueue({name: 'Neha', restaurantId: 1, size: 3, mobile: '4158965693', email: 'nez@gmail.com'}))
    .then(() => dbQuery.addToQueue({name: 'Eugene', restaurantId: 1, size: 3, mobile: '4157855678', email: 'eugene@gmail.com'}))
    .then(() => dbQuery.addToQueue({name: 'Johnny', restaurantId: 1, size: 2, mobile: '4156844758'}))
    .then(() => dbQuery.addToQueue({name: 'Danny', restaurantId: 1, size: 4, mobile: '4166844758'}))
    .then(() => dbQuery.addToQueue({name: 'ShiHao', restaurantId: 1, size: 2, mobile: '4576844758'}))
    .then(() => dbQuery.addToQueue({name: 'Rebecca', restaurantId: 1, size: 8, mobile: '4186844758'}))
    .catch((err) => console.log('there was insertion err', err));
};

const addRestaurants = () => {
  return db.Restaurant.findOrCreate({where: {name: 'Tempest', address: '431 Natoma St, San Francisco, CA 94103', phone: '(123) 456-7890', image: '../images/tempestbar.jpg', status: 'Open', 'average_wait': 10, 'total_wait': 10}})
    .then(() => db.Restaurant.findOrCreate({where: {name: 'House of Prime Rib', address: '1906 Van Ness Ave, San Francisco, CA 94109', phone: '(415) 885-4605', image: '../images/houseofprimerib.jpg', status: 'Open', 'average_wait': 10, 'total_wait': 10}}))
    .then(() => db.Restaurant.findOrCreate({where: {name: 'Tsunami Panhandle', address: '1306 Fulton St, San Francisco, CA 94117', phone: '(415) 567-7664', image: '../images/tsunamipanhandle.jpg', status: 'Open', 'average_wait': 5, 'total_wait': 5}}))
    .then(() => db.Restaurant.findOrCreate({where: {name: 'Kitchen Story', address: '3499 16th St, San Francisco, CA 94114', phone: '(415) 525-4905', image: '../images/kitchenstory.jpg', status: 'Open', 'average_wait': 15, 'total_wait': 15}}))
    .then(() => db.Restaurant.findOrCreate({where: {name: 'Burma Superstar', address: '309 Clement St, San Francisco, CA 94118', phone: '(415) 387-2147', image: '../images/burmasuperstar.jpg', status: 'Open', 'average_wait': 10, 'total_wait': 10}}))
    .then(() => db.Restaurant.findOrCreate({where: {name: 'State Bird Provisions', address: '1529 Fillmore St, San Francisco, CA 94115', phone: '(415) 795-1272', image: '../images/statebirdprovisions.jpg', status: 'Closed', 'average_wait': 8, 'total_wait': 8}}))
    .then(() => db.Restaurant.findOrCreate({where: {name: 'Limon Rotisserie', address: '1001 S Van Ness Ave, San Francisco, CA 94110', phone: '(415) 821-2134', image: '../images/limonrotisserie.jpg', status: 'Closed', 'average_wait': 12, 'total_wait': 12}}))
    .then(() => db.Restaurant.findOrCreate({where: {name: 'Nopa', address: '560 Divisadero St, San Francisco, CA 94117', phone: '(415) 864-8643', image: '../images/nopa.jpg', status: 'Open', 'average_wait': 20, 'total_wait': 20}}))
    .then(() => db.Restaurant.findOrCreate({where: {name: 'Farmhouse Kitchen', address: '710 Florida St, San Francisco, CA 94110', phone: '(415) 814-2920', image: '../images/farmhousekitchen.jpg', status: 'Open', 'average_wait': 15, 'total_wait': 15}}));
};

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
    .then(() => addRestaurants())
    .then(() => addToQueue())
    .then(() => addManager());
};

module.exports = {
  addRestaurants: addRestaurants,
  addToQueue: addToQueue,
  addManager: addManager,
  dropDB: dropDB
};
