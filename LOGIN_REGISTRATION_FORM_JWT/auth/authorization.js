var jwt = require('jsonwebtoken');
var config = require('../config');

var authorization = function(req, res, next) {

    console.log(req.session.token)
    jwt.verify(req.session.token, config.SECRET, function(err, decoded) {
        var msg = { auth: false, message: 'Failed to authenticate token.' };
        if (err)
            res.status(500).send(msg);
        req.userId = decoded.id;
        next();
    });
}

module.exports = authorization;