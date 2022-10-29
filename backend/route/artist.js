const express = require('express');
const artistController = require('../controller/artist');

const router = express.Router();

router.get('/:id', artistController.getArtist);

module.exports = router;