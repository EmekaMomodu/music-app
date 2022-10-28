const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const genreSchema = new Schema(
    {
        id: {
            type: Number,
        },
        parentId: {
            type: Number,
        },
        name: {
            type: String,
        }
    }
);

module.exports = mongoose.model('Genre', genreSchema);