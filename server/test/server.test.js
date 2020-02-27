require('./../config/config');

const expect = require('expect');
const request = require ('supertest');
const {ObjectID} = require('mongodb');


const {app} = require('./../server');
const mongoose = require('./../db/mongoose');
const {User} = require('./../models/User');
const {users, populateUsers} = require('./seed/seed');


const api = '/api/v1.0/';


beforeEach(populateUsers);


describe('Fetch current user data GET /user', () =>{
  it("should return user if authenticated", (done) =>{
    request(app)
    .get(api+'/user')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  })

  //no user-data if token doesn't contain proper token
  it("should return 401 if invalid token provided", (done) =>{
    request(app)
    .get(api+'/user')
    .expect(401)
    .expect((res)=>{
      expect(res.body).toEqual({});
    })
    .end(done);
  })

  it("should return 401 with correct token-auth but access revoked", (done) =>{
    request(app)
    .get(api+'/user')
    .set('x-auth', users[2].tokens[0].token)
    .expect(401)
    .expect((res)=>{
      expect(res.body).toEqual({});
    })
    .end(done);
  })

  it("should return 401, using first token, where token.access->unauth for id x", (done) =>{
    request(app)
    .get(api+'/user')
    .set('x-auth', users[3].tokens[0].token)
    .expect(401)
    .expect((res)=>{
      expect(res.body).toEqual({});
    })
    .end(done);
  })

  it("should return data using another token for same id x", (done) =>{
    request(app)
    .get(api+'/user')
    .set('x-auth', users[3].tokens[1].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body._id).toBe(users[3]._id.toHexString());
      expect(res.body.email).toBe(users[3].email);
    })
    .end(done);
  })


})


describe ('register new users POST /users/register', () =>{
  it ('should create a new User', (done) =>{
     var email = 'example@example.org';
     var password = 'examplePassword';
     request(app)
     .post(api+'/users/register')
     .send({email, password})
     .expect(201)
     .expect((res)=>{
       expect(res.headers['x-auth']).toBeDefined();
       expect(res.body._id).toBeDefined();
       expect(res.body.email).toBe(email);
     })
     .end((err)=>{
       if (err){
         return done (err);
       }
       //verifying for hashed pwd
       User.findOne({email}).then((user)=>{
         expect(user).toBeDefined();
         expect(user.password).not.toBe(password);
         done();
       })
     });
  });


  it('should return validation errors if requests invalid', (done) =>{
    request(app)
    .post(api+'/users/register')
    .send({
      email: 'example.org',
      password: 'abc'
    })
    .expect(400)
    .end(done);
  });

  it('should not create user when email already in use', (done) =>{
    request(app)
    .post(api+'/users/register')
    .send({
      email: users[0].email,
      password: 'anypassword'
    })
    .expect(400)
    .end(done);
  });
});

describe ('login a users by credentials /users/login', () =>{
  it('should return data if email/pass correct', (done) =>{
    request(app)
    .post(api+'/users/login')
    .send({
      email: users[0].email,
      password: users[0].password
    })
    .expect(200)
    .expect((res)=>{
      expect(res.headers['x-auth']).toBeDefined();
      expect(res.body._id).toBeDefined();
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  });

  it('should return 401 if email/pass incorrect', (done) =>{
    request(app)
    .post(api+'/users/login')
    .send({
      email: users[0].email,
      password: users[1].password
    })
    .expect(401)
    .expect((res)=>{
      expect(res.body).toEqual({});
    })
    .end(done);
  });

  it('should return 403 if pass correct but access revoked', (done) =>{
    request(app)
    .post(api+'/users/login')
    .send({
      email: users[2].email,
      password: users[2].password
    })
    .expect(403)
    .end(done);
  });
});

//TODO NEW CASE
