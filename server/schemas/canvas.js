const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CanvasSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    data_url: {
        type: String
    }

})

Canvas = mongoose.model('Canvas', CanvasSchema);
module.exports = Canvas
