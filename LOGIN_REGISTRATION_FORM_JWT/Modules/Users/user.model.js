const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');


const UserSchema = mongoose.Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
    },

});

const UserDataSchema = mongoose.Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    email: {
        type: String,
        lowercase: true,
        required: [true, "can't be blank"],
    },
    phone: {
        type: String,
        length: {
            max: 10
        },
        message: 'Provided phone number is invalid.'
    },
    wallpaper: {
        type: String,
        required: true
    },
    date: Date,
});

UserDataSchema.plugin(mongoosePaginate)
const User = mongoose.model('User', UserSchema);
const UserData = mongoose.model('UserData', UserDataSchema);

module.exports = { User, UserData };