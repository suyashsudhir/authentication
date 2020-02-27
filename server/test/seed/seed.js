const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {User} = require('./../../models/User');


const userId = new ObjectID();
const user2Id = new ObjectID();
const user3Id = new ObjectID();
const user4Id = new ObjectID();
const users =[
  {
  _id : userId,
  email: 'test@test.test',
  password: 'testPassword',
  tokens:
  [{
    access: 'auth',
    token: jwt.sign({_id: userId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
},
{
  _id : user2Id,
  email: 'test2@test.test',
  password: 'test2Password',
},
{
  _id : user3Id,
  email: 'revoke@test.test',
  password: 'testPassword',
  access: 'revoked',
  tokens:
  [{
    access: 'auth',
    token: jwt.sign({_id: user3Id, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
},
{
  _id : user4Id,
  email: 'authrevoked@test.test',
  password: 'testPassword',
  access: 'auth',
  tokens:
  [{
    access: 'unauth',
    token: jwt.sign({_id: user4Id, access: 'diffauth'}, process.env.JWT_SECRET).toString()
   },{
    access: 'auth',
    token: jwt.sign({_id: user4Id, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}];

const populateUsers = (done) => {
  //clear db because we can't use the same db which is live
  //because it can return different results based on diff requests
  //we need to fix this ambiguity...so that we can guarantee
  //what is in db... so will empty db and seed some demo data

  User.remove({}).then(() =>{
    var user = new User(users[0]).save();
    var user2 = new User(users[1]).save();
    var userRevoked = new User(users[2]).save();
    var userAuthbutaccessUnauth = new User(users[3]).save();
    return Promise.all([user, user2, userRevoked, userAuthbutaccessUnauth]);
  }).then(() => done());
};

module.exports = {users, populateUsers};
