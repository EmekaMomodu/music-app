const Response = require('../dto/response');
const messages = require('../constant/message');
const Artist = require('../model/artist');
const ArtistDto = require('../dto/artist');

exports.getArtistById = (req, res, next) => {
    const artistId = req.params.id;
    console.log("artistId ::: " + artistId);
    Artist.findOne({artist_id: artistId})
        .then(artist => {
            console.log("artist ::: " + artist);
            if (!artist) {
                const error = new Error(messages.NO_DATA_FOUND);
                error.statusCode = 404;
                return next(error);
            }
            const foundArtist = new ArtistDto(
                artist.artist_id || null,
                artist.artist_name || null,
                artist.artist_location || null,
                artist.artist_handle || null,
                artist.artist_contact || null,
                artist.artist_associated_labels || null,
                artist.artist_active_year_begin || null
            );
            const response = new Response(messages.DATA_FETCHED_SUCCESSFULLY, foundArtist);
            res.status(200).json(response);
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};