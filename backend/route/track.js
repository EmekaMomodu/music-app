const express = require('express');
const trackController = require('../controller/track');

const router = express.Router();

router.get('/:id', trackController.getTrackById);

router.get('', trackController.getNTracksByTitleOrAlbum);

module.exports = router;