const Response = require('../model/response');
const messages = require('../constant/message');
const Genre = require('../model/genre');

exports.getGenres = (req, res, next) => {
    Genre.find()
        .select({genreId: 1, parentId: 1, title: 1, _id: 0})
        .then(genres => {
            if(genres.length === 0){
                const error = new Error(messages.NO_DATA_FOUND);
                error.statusCode = 404;
                return next(error);
            }
            const response = new Response(messages.DATA_FETCHED_SUCCESSFULLY, genres);
            res.status(200).json(response);
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};