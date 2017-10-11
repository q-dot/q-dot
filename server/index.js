const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
const port = process.env.PORT || 1337;
const db = require('../database/index.js');
const dbQuery = require('../controller/index.js');
const dbManagerQuery = require('../controller/manager.js');
const dummyData = require('../database/dummydata.js');
const testData = require('../database/testData.js'); // remove when done testing
const helpers = require('../helpers/helpers.js');
const bodyParser = require('body-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const passport = require('./passport.js');
const Nexmo = require('nexmo');
const request = require('request');
const yelp = require('yelp-fusion');
const nodemailer = require('nodemailer');
const configs = require('./config/config.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//checks if session already exists, if it does, adds req.session to req object
app.use(session({
  store: new RedisStore({
    host: process.env.REDISURL || '107.170.208.112',
    port: process.env.REDISPORT || 6379
  }),
  secret: process.env.SESSIONSECRET || 'nyancat',
  saveuninitialized: false,
  cookie: {
    maxAge: 18000000
  },
  name: 'qsessionid',
  resave: false
}));

//Set up node mailer
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: configs.emailUsername + '@gmail.com',
    pass: configs.emailPass
  }
});

const nexmo = new Nexmo({
  apiKey: configs.nexmoAPIKey,
  apiSecret: configs.nexmoAPISecret
});

//these middlewares initialise passport and adds req.user to req object if user has aleady been authenticated
app.use(passport.initialize());
app.use(passport.session());

//this is to check if manager is logged in, before using static middleware. MUST always be above express.static!

// TODO: add DB lookup to chain
app.get('/manager', (req, res, next) => {
  console.log('GET manager');
  if (req.user) {
    console.log('logged in');
    next();
  } else {
    res.redirect('/managerlogin');
  }
});

app.use(express.static(path.resolve(__dirname, '../client/dist')));

//this shows how you can get queue information from the cookie of a customer who has already queue up
app.use((req, res, next) => {
  if (req.session.queueInfo) {
    console.log(req.session.queueInfo);
  }
  next();
});

app.get('/', (req, res) => {
  console.log('Redirecting a customer');
  if (req.session.queueInfo) {
    res.redirect(`/customer/queueinfo?queueId=${req.session.queueInfo.queueId}`);
  } else {
    res.redirect('/customer');
  }
});

app.get('/redirect', (req, res) => {
  console.log('Redirect requested!', req.session);
  req.session.destroy((err) => {
    console.log('destroy session');
    res.cookie('qsessionid', '', { expires: new Date() });
    res.send('/customer');
  });
});

//get info for one restaurant or all restaurants
app.get('/restaurants', (req, res) => {
  if (req.query.restaurantId) {
    dbQuery.findInfoForOneRestaurant(req.query.restaurantId)
      .then(results => res.send(results))
      .catch(error => {
        console.log('error getting info for one restaurants', error);
        res.send('failed for one restaurant');
      });
  } else {
    dbQuery.findInfoForAllRestaurants()
      .then(restaurants => res.send(restaurants))
      .catch(error => {
        console.log('error getting info for all restaurants', error);
        res.send('failed for info on all restaurants');
      });
  }
});

//drop database and add dummy data
app.post('/dummydata', (req, res) => {
  dummyData.dropDB()
    .then(() => {
      res.sendStatus(200);
    })
    .catch(error => {
      console.log('error posting dummydata', error);
      res.send('could not add dummydata');
    });
});

//add a customer to the queue at a restaurant
// this throws error 418
app.post('/queues', (req, res) => {
  console.log('POST to queues: ', req.body);
  if (!req.body.name || !req.body.mobile || !req.body.restaurantId
      || !req.body.size) {
    res.status(400).send('Bad Request');
  } else {
    dbQuery.addToQueue(req.body)
      .then(response => {
        console.log('res from adding to queue db: ', response);
        const result = {
          name: helpers.nameFormatter(req.body.name),
          mobile: helpers.phoneNumberFormatter(req.body.mobile)
        };
        if (req.body.email) {
          result.email = req.body.email;
        }
        if (req.body.address) {
          result.address = req.body.address;
        }
        result.queueId = response.queueId;
        result.size = response.size;
        result.position = response.position;
        result.queueInFrontCount = response.queueCount;
        result.wait = response.wait;
        result.queueInFrontList = response.queueList;
        req.session.queueInfo = result;
        console.log('result from server: ', result);
        res.send(result);
        //automatically update manager side client
        // this just sends the same id back
        console.log('sending back to client rest id: ', req.body.restaurantId);
        socketUpdateManager(req.body.restaurantId);
      })
      .catch(err => {
        if (err.message.includes('closed')) {
          res.send(err.message);
        } else if (err.message.includes('added')) {
          res.send(err.message);
        } else {
          console.log('error during post for queue', err);
          res.status(418).send('Request Failed');
        }
      });
  }
});

//update the status of a restaurant
app.patch('/restaurants', (req, res) => {
  if (req.query.status && (req.query.status === 'Open' || req.query.status === 'Closed')) {
    dbQuery.updateRestaurantStatus(req.query)
      .then(result => res.send(`Status for restaurant with id ${req.query.restaurantId} is now ${req.query.status}`))
      .catch(err => res.status(418).send('Update for restaurant status failed'));
  } else {
    res.status(400).send('Bad Request');
  }
});

//get queue info
app.get('/queues', (req, res) => {
  if (req.query.queueId) {
    var results = {};
    dbQuery.getCustomerInfo(req.query.queueId)
      .then(partialResults => {
        /*
        console.log('**********partialResults on server get: ', partialResults.customer);
          partialResults on server get:  customer {
            dataValues: 
             { id: 5,
               name: 'X Yz',
               address: '1234 ewsa st, sf, ca',
               mobile: '23454434',
               email: 'lkko@oiin',
               createdAt: 2017-10-11T00:16:44.934Z,
               updatedAt: 2017-10-11T00:16:44.934Z },
        */
        results.name = partialResults.customer.name;
        results.address = partialResults.customer.address;
        results.mobile = partialResults.customer.mobile;
        results.email = partialResults.customer.email;
        results.queueId = partialResults.id;
        results.size = partialResults.size;
        results.position = partialResults.position;
        results.wait = partialResults.wait;
        results.restaurant = partialResults.restaurant;
        return dbQuery.getQueueInfo(partialResults.restaurantId, partialResults.customerId, partialResults.position);
      })
      .then(partialResults => {
        results.queueInFrontCount = partialResults.count;
        results.queueInFrontList = partialResults.rows;
        res.send(results);
      })
      .catch(err => {
        res.status(418).send('Unknown Error - Check customerId');
      });
  } else {
    res.status(400).send('Bad request');
  }
});

//remove customer from queue at a restaurant
app.put('/queues', (req, res) => {
  if (!req.query.queueId) {
    res.status(400).send('Bad Request');
  } else {
    dbQuery.removeFromQueue(req.query.queueId)
      .then(result => res.send(result))
      .catch(err => {
        if (err.message.includes('removed')) {
          res.send(err.message);
        } else {
          console.log('error when removing from queue', err);
          res.status(418).send('Request Failed');
        }
      });
  }
});

//login a manager for a restaurant
app.post('/managerlogin', passport.authenticate('local'), (req, res) => {
  dbManagerQuery.addAuditHistory('LOGIN', req.user.id)
    .then(() => dbQuery.findRestaurauntByManager(req.user.id))
    .then(results => {
      console.log('found', results.dataValues.id);
      res.send(`/manager?id=${results.dataValues.id}`);
    });
});

//request for logout of manager page of a restaurant
app.get('/logout', (req, res) => {
  dbManagerQuery.addAuditHistory('LOGOUT', req.user.id)
    .then(results => {
      req.logout();
      res.redirect('/managerlogin');
    })
    .catch((err) => {
      console.log('error adding audit hist', err);
    })
});

//this must have originally been for an existing manager adding another manager
// to the same restaurant
//add a new manager login for a restaurant
app.post('/manager', (req, res) => {
  // if (req.user) {
    if (!req.body.password || !req.body.username) {
      res.sendStatus(400);
    } else {
      var passwordInfo = dbManagerQuery.genPassword(req.body.password, dbManagerQuery.genSalt());
      dbManagerQuery.addManager(req.body.username, passwordInfo.passwordHash, passwordInfo.salt)
        .then(results => res.send(results));
    }
//  } else {
    // res.sendStatus(401);
  // }
});

//returns manager login/logout history
app.get('/manager/history', (req, res) => {
  if (req.user) {
    dbManagerQuery.getAuditHistory().then(results => res.send(results));
  } else {
    res.sendStatus(401);
  }
});

//deletes manager login/logout history
app.delete('/manager/history', (req, res) => {
  if (req.user) {
    dbManagerQuery.deleteAuditHistory().then(results => res.send(results));
  } else {
    res.sendStatus(401);
  }
});

// need to add manager before restaurant b/c FK on restaurant
app.post('/restaurants', (req, res) => {
<<<<<<< HEAD
  var passwordInfo = dbManagerQuery.genPassword(req.body.manager.password, dbManagerQuery.genSalt());

  dbManagerQuery.addManager(req.body.manager.username, passwordInfo.passwordHash, passwordInfo.salt)
    .then((results) => {
      managerId = results[0].dataValues.id;
      restaurantInfo = req.body.restaurant;
      restaurantInfo.managerId = managerId;
      dbQuery.addRestaurant(restaurantInfo);
    })
=======
  dbQuery.addRestaurant(testData.restaurant)
>>>>>>> client and restaurant address added to frontend and database
    .then((results) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log('Error POST /restaurants ', err);
      res.sendStatus(401);
    });
<<<<<<< HEAD
});

// *** YELP ***
app.post('/yelp', (req, res) => {

  yelp.accessToken(configs.YELP_CLIENT_ID, configs.YELP_SECRET)
  .then(response => {
    token = response.jsonBody.access_token;
    client = yelp.client(token);

    client.search({
      term: req.body.query,
      location: req.body.location
    })
    .then(result => {
      res.send(result.jsonBody.businesses);
    })
    .catch(e => {
      console.log(e);
    });
  })
  .catch(e => {
    console.log(e);
  });
=======
>>>>>>> client and restaurant address added to frontend and database
});


server.listen(port, () => {
  console.log(`(>^.^)> Server now listening on ${port}!`);
});

// socket io cant use express listen
// app.listen(port, () => {
//   console.log(`(>^.^)> Server now listening on ${port}!`);
// });

let queueMap = {};// queueId: socketId
let managerMap = {};// restaurantId: socketId

io.on('connection', (socket) => {
  console.log(`${socket.id} connected`);

  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`);
  });

  //manager event
  socket.on('manager report', (restaurantId) => {
    console.log(`restaurantId: ${restaurantId} manager reporting with socket id: ${socket.id}`);
    managerMap[restaurantId] = socket.id;
  });

  socket.on('noti customer', (queueId, placeName, customer) => {
    if (queueMap[queueId]) {
      // console.log('A customer is to be notified for their booking at', placeName);
      let mailOptions = {
        from: configs.emailUsername + '@gmail.com',
        to: customer.email,
        subject: 'Your table booked at ' + placeName + ' is ready!',
        text: 'Hello ' + customer.name + '!\n\nThe table you booked with Q. is now ready for you. We hope you enjoy your dining experience at '
          + placeName + '\n\nBon Appétit,\nQ.'
      };

      //Don't even try to text if it's not valid format with country code. only works for USA
      let phoneToUse = helpers.filterPhoneForNexmo(customer.mobile);
      console.log(phoneToUse, 'should get an SMS. It has length', phoneToUse.length);
      if (phoneToUse.length === 11) {
        helpers.sendSMS(nexmo, configs.virtualNumber, phoneToUse, placeName);
      }

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      io.to(queueMap[queueId]).emit('noti', 'your table is ready!');
    }
  });

  //customer event
  socket.on('customer report', (queueId) => {
    console.log(`queueId: ${queueId} customer reporting with socket id: ${socket.id}`);
    queueMap[queueId] = socket.id;
  });
});

// send message to manager client to update the queue
const socketUpdateManager = (restaurantId) => {
  if (managerMap[restaurantId]) {
    io.to(managerMap[restaurantId]).emit('update', 'queue changed');
  }
};
