const Response = require('../dto/response');
const messages = require('../constant/message');
const Track = require('../model/track');
const TrackDto = require('../dto/track');

exports.getTrackById = (req, res, next) => {
    const trackId = req.params.id;
    console.log("trackId ::: " + trackId);
    Track.findOne({track_id: trackId})
        .then(track => {
            console.log("track ::: " + track);
            if (!track) {
                const error = new Error(messages.NO_DATA_FOUND);
                error.statusCode = 404;
                return next(error);
            }
            const foundTrack = new TrackDto(
                track.track_id || null,
                track.album_id || null,
                track.album_title || null,
                track.artist_id || null,
                track.artist_name || null,
                track.tags || null,
                track.track_date_created || null,
                track.track_date_recorded || null,
                track.track_duration || null,
                track.track_genres || null,
                track.track_number || null,
                track.track_title || null
            );
            const response = new Response(messages.DATA_FETCHED_SUCCESSFULLY, foundTrack);
            res.status(200).json(response);
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};