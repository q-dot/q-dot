const db = require('../database/index.js');
const { ne, lt, gt } = db.Sequelize.Op;
const helpers = require('../helpers/helpers.js');

//find info for one restaurant with current queue information
const findInfoForOneRestaurant = (restaurantId) => {
  return db.Restaurant.find({
    where: {
      id: restaurantId
    },
    include: [{
      model: db.Queue,
      where: {
        position: {
          [ne]: null
        }
      },
      include: [db.Customer],
      required: false
    }]
  });
};

//find info for all restaurants with current queue information
const findInfoForAllRestaurants = () => {
  return db.Restaurant.findAll({include: [db.Queue]})
    .then(restaurants => {
      restaurants.forEach(restaurant => {
        restaurant.dataValues.queues = restaurant.queues.filter(row => row.position !== null);
      });
      return restaurants;
    });
};

const findRestaurauntByManager = (managerId) => {
  return db.Restaurant.findOne({where: {
      managerId: managerId // CHANGE THIS TO MANAGERID AFTER TESTING
    }
  });
}

//update restaurant open/close status
const updateRestaurantStatus = (info) => {
  return db.Restaurant.update({status: info.status}, {where: {id: info.restaurantId}});
};

// successfully adding
// find/add customer to database
const findOrAddCustomer = (params) => {
  return db.Customer.findOne({where: {mobile: params.mobile}})
    .then(customer => {
      if (customer === null) {
        const customer = {
          name: helpers.nameFormatter(params.name),
          mobile: helpers.phoneNumberFormatter(params.mobile)
        };

        if (params.email) {
          customer.email = params.email;
        }

        return db.Customer.create(customer);
      } else {
        return customer;
      }
    });
};


// get current queue info for one restaurant
const getQueueInfo = (restaurantId, customerId, customerPosition) => {
  return db.Queue.findAndCountAll({
    where: {
      restaurantId: restaurantId,
      position: {
        [ne]: null,
        [lt]: customerPosition
      }
    }
  });
};

//add a customer to a queue at a restaurant
const addToQueue = (params) => {
  console.log('adding to queue, params ', params);
  const queueInfo = {
    size: params.size,
  };
  const response = {};

  return findOrAddCustomer(params) // cust added ok
    .then(customer => {
      queueInfo.customerId = customer.id;
      queueInfo.name = customer.name;
      console.log('cust info after adding: ', queueInfo);
      return db.Queue.findOne({where: {customerId: customer.id, restaurantId: params.restaurantId}});
    })
    .then(row => {
      console.log('result from findOne', row);
      if (row !== null) {
        throw new Error('Already added');
      } else {
        console.log('looking up rest ID')
        return findInfoForOneRestaurant(params.restaurantId);
      }
    })
    .then(restaurant => {


      console.log('Rest obj', restaurant)
      if (restaurant.status === 'Open') { // NOT GETTING STATUS
        queueInfo.position = restaurant.nextPosition + 1;
        queueInfo.wait = restaurant.total_wait;
        queueInfo.restaurantId = restaurant.id;
        let totalWait = restaurant.total_wait + restaurant.average_wait;
        return db.Restaurant.upsert({'nextPosition': queueInfo.position, 'total_wait': totalWait, phone: restaurant.phone});
      } else {
        throw new Error('Restaurant has closed the queue');
      }
    })
    .then(result => {
      return db.Queue.create(queueInfo);
    })
    .then(result => {
      response.wait = result.wait;
      response.queueId = result.id;
      response.size = result.size;
      response.position = result.position;
      return getQueueInfo(result.restaurantId, result.customerId, queueInfo.position);
    })
    .then(result => {
      response.queueList = result.rows;
      response.queueCount = result.count;
      return response;
    });
};

// get queue info for one customer
const getCustomerInfo = (queueId) => {
  return db.Queue.findOne({
    where: {
      id: queueId
    },
    include: [db.Customer, db.Restaurant]
  });
};

// get info for one manager
const getManagerInfo = (username) => {
  return db.Manager.findOne({
    where: {
      username: username
    }
  });
};

//remove customer from queue
const removeFromQueue = (queueId) => {
  let restaurant;
  return db.Queue.find({where: {id: queueId}, include: [db.Restaurant]})
    .then(row => {
      if (!row.position && !row.wait) {
        throw new Error('Already removed');
      } else {
        restaurant = row.restaurant;
        return db.Queue.findAll({where: {position: {[ne]: null, [gt]: row.position}}});
      }
    })
    .then(result => result.map(row => db.Queue.upsert({wait: row.wait - restaurant.average_wait, id: row.id})))
    .then(() => db.Restaurant.upsert({'total_wait': restaurant.total_wait - restaurant.average_wait, phone: restaurant.phone}))
    .then(() => db.Queue.upsert({position: null, wait: null, id: queueId}))
    .then(() => getQueueInfo(restaurant.id, 0, restaurant.nextPosition + 1));
};

const addRestaurant = (restaurantInfo) => {
  return db.Restaurant.create(restaurantInfo);
};


module.exports = {
  findInfoForAllRestaurants: findInfoForAllRestaurants,
  findInfoForOneRestaurant: findInfoForOneRestaurant,
  findOrAddCustomer: findOrAddCustomer,
  addToQueue: addToQueue,
  updateRestaurantStatus: updateRestaurantStatus,
  getQueueInfo: getQueueInfo,
  getCustomerInfo: getCustomerInfo,
  getManagerInfo: getManagerInfo,
  removeFromQueue: removeFromQueue,
  addRestaurant: addRestaurant,
  findRestaurauntByManager: findRestaurauntByManager
};
