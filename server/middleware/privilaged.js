var {User} = require('./../models/User');

var privilaged = (req, res, next) => {
  //Find if he is auth and roles contain hisrole
  // User.findByToken(token).then((user) =>{
  //   if(!user){
  //     return Promise.reject();
  //   }
  //   req.user = user;
  //   req.token = token;
  //
  //   next();
  // }).catch((e)=>{
  //   res.status(403).send();
  // });
};

module.exports = {privilaged};
