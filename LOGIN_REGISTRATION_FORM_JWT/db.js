const config = require('./config');
const mongoose = require('mongoose');
var { User, UserData } = require('./Modules/Users/user.model')
mongoose.connect(config.DATABASE, { useNewUrlParser: true })
    .then(() => {
        console.log(`Succesfully Connected to theMongodb Database..`)
    })
    .catch(() => {
        console.log(`Error Connecting to the Mongodb Database...`)
    })
mongoose.Promise = global.Promise;

module.exports = {
    User,
    UserData
};