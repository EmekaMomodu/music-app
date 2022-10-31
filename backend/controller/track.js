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

exports.getNTracksByTitleOrAlbum = (req, res, next) => {
    const searchText = req.query.searchText;
    const n = req.query.n;
    console.log("searchText ::: " + searchText);
    console.log("n ::: " + n);
    if (!searchText || !n || !/^\+?([1-9]\d*)$/.test(n)) {
        const error = new Error(messages.ONE_OR_MORE_REQUIRED_REQUEST_PARAMETERS_ARE_MISSING_OR_INVALID);
        error.statusCode = 400;
        return next(error);
    }
    Track.find({
        $or: [{album_title: {$regex: '.*' + searchText + '.*', $options: 'i'}},
            {track_title: {$regex: '.*' + searchText + '.*', $options: 'i'}}]
    }).limit(n)
        .then(tracks => {
            if (tracks.length === 0) {
                const error = new Error(messages.NO_DATA_FOUND);
                error.statusCode = 404;
                return next(error);
            }
            const foundTracks = tracks.map((track) => {
                return new TrackDto(
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
            });
            const response = new Response(messages.DATA_FETCHED_SUCCESSFULLY, foundTracks);
            res.status(200).json(response);
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};