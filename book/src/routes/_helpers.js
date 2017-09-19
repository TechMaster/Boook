const request = require('request-promise');
let userURL = 'http://localhost:3003'
let ensureAuthenticated = (req, res, next) => {
  if (!(req.headers && req.headers.authorization)) {
    return res.status(400).json({ status: 'Please log in' });
  }
  let username = req.headers.username;
  // call users-service to authenticate and get user info
  const options = {
    method: 'GET',
    uri: `${userURL}/api/userbyusername/${username}`,
    json: true,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${req.headers.authorization.split(' ')[1]}`,
    },
  };
  return request(options)
    .then((response) => {
    // response is user data received from users-service
      req.user_id = response.id;
      return next();
    })
    .catch((err) => { return next(err); });
};

module.exports = {
  ensureAuthenticated,
};
