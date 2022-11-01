const Response = require('../dto/response');
const messages = require('../util/message');
const playlistService = require('../service/playlist');

exports.createPlaylist = async (req, res, next) => {
    try {
        const playlist = await playlistService.createPlaylist(req.body);
        const response = new Response(messages.DATA_CREATED_SUCCESSFULLY, playlist);
        res.status(201).json(response);
    } catch (error) {
        if (!error.statusCode) error.statusCode = 500;
        next(error);
    }
};

exports.updatePlaylistByName = async (req, res, next) => {
    try {
        const playlist = await playlistService.updatePlaylistByName(req.body);
        const response = new Response(messages.DATA_UPDATED_SUCCESSFULLY, playlist);
        res.status(200).json(response);
    } catch (error) {
        if (!error.statusCode) error.statusCode = 500;
        next(error);
    }
};

exports.getPlaylistById = async (req, res, next) => {
    try {
        const playlist = await playlistService.getPlaylistById(req.params.id);
        const response = new Response(messages.DATA_FETCHED_SUCCESSFULLY, playlist);
        res.status(200).json(response);
    } catch (error) {
        if (!error.statusCode) error.statusCode = 500;
        next(error);
    }
};

exports.getPlaylistByName = async (req, res, next) => {
    try {
        const playlist = await playlistService.getPlaylistByName(req.query.name);
        const response = new Response(messages.DATA_FETCHED_SUCCESSFULLY, playlist);
        res.status(200).json(response);
    } catch (error) {
        if (!error.statusCode) error.statusCode = 500;
        next(error);
    }
};

exports.deletePlaylistByName = async (req, res, next) => {
    try {
        await playlistService.deletePlaylistByName(req.query.name);
        const response = new Response(messages.DATA_DELETED_SUCCESSFULLY, null);
        res.status(200).json(response);
    } catch (error) {
        if (!error.statusCode) error.statusCode = 500;
        next(error);
    }
};