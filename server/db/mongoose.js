var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
  // reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  // reconnectInterval: 500, // Reconnect every 500ms
};

mongoose
  .connect(process.env.MONGODB_URI, options)
  .then(res => {
    console.log("##############  successfully connected to db ##############");
  }).catch(e => console.log("------------ Failed connection db -------", e));

// const connectWithRetry = function() {
//   return mongoose.connect(process.env.MONGODB_URI, options, (err) => {
//     if (err) {
//       console.error(
//         "Failed to connect to mongo on startup - retrying in 5 sec",
//         err
//       );
//       setTimeout(connectWithRetry, 5000);
//     }
//     else{
      
//     }
//   });
// };
// connectWithRetry();

module.exports = {
  mongoose
};
