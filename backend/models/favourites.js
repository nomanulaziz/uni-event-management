const mongoose = require("mongoose");

const {Schema} = mongoose;

const favouriteSchema = new Schema({
    f_event: {type: mongoose.SchemaTypes.ObjectId, ref:'User'}
},
    {timestamps: true}
);

module.exports = mongoose.model('Favourite',favouriteSchema, 'favourites');