const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    host_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    room_token: {
        type: String
    },
    canvas_id: {
        type: Schema.Types.ObjectId,
        ref: 'Canvas'
    }

})

Room = mongoose.model('Room', RoomSchema);
module.exports = Room;
