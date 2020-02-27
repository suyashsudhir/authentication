var secureConnection = (req, res, next) => {
  if(req.protocol === 'https'){

    next();
  }else{
    res.status(101).send();
  }
};

//
// req.ips
// When the trust proxy setting does not evaluate to false, this property contains an array of IP addresses specified in the X-Forwarded-For request header. Otherwise, it contains an empty array. This header can be set by the client or by the proxy.
//
// For example, if X-Forwarded-For is client, proxy1, proxy2, req.ips would be ["client", "proxy1", "proxy2"], where proxy2 is the furthest downstream.


// If you run your app behind proxy, enable 'trust proxy' so req.protocol reflects the protocol that's been used to communicate between client and proxy.
//
// app.enable('trust proxy');


module.exports = {secureConnection};
