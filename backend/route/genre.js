const express = require('express');
const genreController = require('../controller/genre');

const router = express.Router();

router.get('', genreController.getGenres);

module.exports = router;