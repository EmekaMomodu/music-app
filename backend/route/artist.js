const express = require('express');
const artistController = require('../controller/artist');

const router = express.Router();

router.get('/:id', artistController.getArtistById);

module.exports = router;