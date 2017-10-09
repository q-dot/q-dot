const db = require('../database/index.js');
const dbQuery = require('../controller/index.js');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const dbManagerQuery = require('../controller/manager.js');
passport.use(new LocalStrategy(
  function(username, password, done) {
    dbQuery.getManagerInfo(username)
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'incorrect username' });
        }
        var inputPassword = dbManagerQuery.genPassword(password, user.passwordSalt);
        if (user.passwordHash !== inputPassword.passwordHash) {
          return done(null, false, { message: 'incorrect password' });
        }
        return done(null, user);
      })
      .catch(err => done(err));
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('deserializing user: ', id);
  db.Manager.findById(id).then(user => done(null, user)).catch(err => done(err, null));
});

module.exports = passport;

