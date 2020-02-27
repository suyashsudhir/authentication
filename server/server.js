require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./db/mongoose');

const port = process.env.PORT;

const app = express();
const routes = require('./routes/routes');

// Enable CORS from client-side
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
// This is c


app.use(bodyParser.json());




//If we were to pass /users to an app.get(), our function would only be invoked
//when someone visited exactly /users, however, when we pass /users to app.use()
//it will beinvoked everytime when req has /users in it




app.use('/api/v1.0/', routes);
//app.use('/public/', routes2);

app.get('/', (req, res) => {
  res.send('Working');
});

// Handle 404 error.
// The last middleware.
app.use("*", function(req, res) {
  //To generalise and hide the fact that it was not found(404)
  res.status(500)
    .send();
});


app.listen(port, () => {
  console.log(`Started up at port ${port} open http://127.0.0.1:3000/`);
});

//For Testing purpose
module.exports = {
  app,
  routes
};


//TODO use express-session