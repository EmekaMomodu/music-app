const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const genreSchema = new Schema(
    {
        genreId: {
            type: Number,
        },
        parentId: {
            type: Number,
        },
        title: {
            type: String,
        }
    }
);

module.exports = mongoose.model('Genre', genreSchema);