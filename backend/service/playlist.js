const messages = require('../util/message');
const Playlist = require('../model/playlist');
const Track = require('../model/track');
const TrackDto = require("../dto/track");
const PlaylistDto = require('../dto/playlist');

exports.createPlaylist = async (playlist) => {

    let {name, trackIds} = playlist;

    if (!name || !trackIds || !trackIds.length) {
        const error = new Error(messages.ONE_OR_MORE_REQUIRED_REQUEST_PARAMETERS_ARE_MISSING_OR_INVALID);
        error.statusCode = 400;
        throw error;
    }

    name = name.trim();

    // find if name already exists throw error if yes
    const existingPlaylist = await Playlist.findOne({name: {$regex: name, $options: 'i'}}).exec();

    console.log("existingPlaylist ::: " + existingPlaylist);

    if (existingPlaylist) {
        const error = new Error(messages.PLAYLIST_NAME_ALREADY_EXISTS);
        error.statusCode = 400;
        throw error;
    }

    // traverse track list and find if trackIds exist in track table and get full track details, append to new list
    let existingTrack;
    let tracks = [];
    for (let trackId of trackIds) {
        existingTrack = await Track.findOne({track_id: trackId}).exec();
        if (!existingTrack) {
            const error = new Error(messages.ONE_OR_MORE_IDS_ARE_INVALID);
            error.statusCode = 400;
            throw error;
        }
        tracks.push(existingTrack);
    }

    const savedPlaylist = await new Playlist({name: name, tracks: tracks}).save();

    if (!savedPlaylist) {
        const error = new Error(messages.UNABLE_TO_SAVE_DATA);
        error.statusCode = 500;
        throw error;
    }

    const savedTracks = savedPlaylist.tracks.map((track) => {
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

    return new PlaylistDto(savedPlaylist._id, savedPlaylist.name, savedTracks);

};