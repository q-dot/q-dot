const Sequelize = require('sequelize');
let db;

if (process.env.DATABASE_URL) {
  db = new Sequelize(process.env.DATABASE_URL);
} else {
  db = new Sequelize({
    database: 'qdot',
    username: 'postgres',
    password: 'qdot',
    dialect: 'postgres',
    port: 5000
  });
}


db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

//Customer Schema
const Customer = db.define('customer', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: Sequelize.STRING,
  mobile: {
    type: Sequelize.STRING,
    unique: true
  },
  email: Sequelize.STRING
});

//Queue Schema
const Queue = db.define('queue', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  position: Sequelize.INTEGER
});

//Restaurant Schema
const Restaurant = db.define('restaurants', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: Sequelize.STRING,
  phone: {
    type: Sequelize.STRING,
    unique: true
  },
  queue_count: Sequelize.INTEGER

});

//Relationship between Restaurant & Queue
Restaurant.hasMany(Queue);
Queue.belongsTo(Restaurant);

//Relationsgip between Customer & Queue
Customer.hasOne(Queue);
Queue.belongsTo(Customer);


Customer.sync();
Queue.sync();
Restaurant.sync();

const dropAllTables = () => {
  db.drop().then((result) => console.log('Deleted all tables', result))
  .catch((err) => console.log('Failed to delete table', err));
};


const findInfoForOneRestaurant = () => {
  //get info for one restaurant
};

const findInfoForAllRestaurants = () => {
  //get information for all restaurants
};

const addDummyData = () => {
  Restaurant.findOrCreate({where: {name: 'Tempest', phone: '1234567890', queue_count: 0}})
  .then(result => console.log('added/found restaurant to database'))
  .catch(err => console.log('error adding restaurant to database', err));

  Customer.findOrCreate({where: {name: 'Tiffany', mobile: '2345639762'}})
  .then(result => console.log('added/found customer to database'))
  .catch(err => console.log('error adding customer to database', err));

  Customer.findOrCreate({where: {name: 'Neha', mobile: '7869874567'}});
  Customer.findOrCreate({where: {name: 'Eugene', mobile: '9750978967'}});
  Customer.findOrCreate({where: {name: 'Johnny', mobile: '4567305746'}});
};

addDummyData();



module.exports = {
  db: db,
  Customer: Customer,
  Queue: Queue,
  Restaurant: Restaurant,
  dropAllTables: dropAllTables,
  findInfoForAllRestaurants: findInfoForAllRestaurants,
  findInfoForOneRestaurant: findInfoForOneRestaurant
};
