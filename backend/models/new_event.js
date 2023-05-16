const mongoose = require("mongoose");
const {Schema} = mongoose;

const newEventSchema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    // type: {type: String, required: true},
    // date: {type: Date, required: true},
    // time: {type: String, required: true},
    // venue: {type: String, required: true},
    image: {type: String, required: true},
    admin: {type: mongoose.SchemaTypes.ObjectId, ref: 'User'}
    //reference value = model name
},
    {timestamps: true}
);

module.exports = mongoose.model('New_event', newEventSchema, 'events');