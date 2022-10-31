const Response = require('../dto/response');
const messages = require('../constant/message');
const Playlist = require('../model/playlist');
const PlaylistDto = require('../dto/playlist');
const PlaylistService = require('../service/playlist');

exports.createPlaylist = async (req, res, next) => {
    try {
        const createdPlaylist = await PlaylistService.createPlaylist(req.body);
        const response = new Response(messages.DATA_CREATED_SUCCESSFULLY, createdPlaylist);
        res.status(201).json(response);
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};