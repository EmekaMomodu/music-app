const Response = require('../dto/response');
const messages = require('../constant/message');
const Genre = require('../model/genre');
const GenreDto = require('../dto/genre');

exports.getGenres = (req, res, next) => {
    Genre.find()
        .then(genres => {
            if (genres.length === 0) {
                const error = new Error(messages.NO_DATA_FOUND);
                error.statusCode = 404;
                return next(error);
            }
            const foundGenres = genres.map((genre) => {
                return new GenreDto(genre.genre_id, genre.title, genre.parent);
            });
            const response = new Response(messages.DATA_FETCHED_SUCCESSFULLY, foundGenres);
            res.status(200).json(response);
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};