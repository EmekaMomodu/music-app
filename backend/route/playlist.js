const express = require('express');
const playlistController = require('../controller/playlist');

const router = express.Router();

router.post('', playlistController.createPlaylist);

router.put('', playlistController.updatePlaylistByName);

module.exports = router;