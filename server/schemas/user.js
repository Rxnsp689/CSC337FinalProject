const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String
    },
    salt: {
        type: String
    },
    hash:{
        type:String
    }
});

User = mongoose.model('User', UserSchema);
module.exports = User;
