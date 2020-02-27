const routes = require('express')
  .Router();
const _ = require('lodash');

const {
  authenticate
} = require('./../middleware/authenticate');
const {
  User
} = require('./../models/User');

routes.route('/users/register')
  .post((req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    user.save()
      .then(() => {
        return user.generateAuthToken();
      })
      .then((token) => {
        var userObject = _.omit(user, 'access', 'tokens', 'createdAt', 'updatedAt', 'password', '__v');
        res.status(201)
          .header('x-auth', token)
          .send(userObject);
      })
      .catch((e) => {
        res.status(400)
          .send();
      })
  });

routes.route('/users/login')
  .get((req, res) => {
    res.send('this might be used in future for login links');
  })
  .post((req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password)
      .then((user) => {
        return user.generateAuthToken()
          .then((token) => {
            var userObject = _.omit(user, 'access', 'tokens', 'createdAt', 'updatedAt', 'password', '__v');
            res.header('x-auth', token)
              .send(userObject);
          });
      })
      .catch((e) => {
        res.status(e)
          .send();
      });
  });

routes.route('/user')
  .get(authenticate, (req, res) => {
    res.send(req.user);
  });

module.exports = routes;