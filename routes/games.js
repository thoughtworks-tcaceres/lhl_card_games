const express = require('express');
const router = express.Router();
const db = require('../db/db');
const {isLoggedIn} = require('../bin/helpers/middleware');

const room_data = {
  rabbit: {},
  dog: {},
  Woodpecker: {}
};

const game_data = {
  whosbigger: {room_data: {}},
  kingsCup: {room_data: {}},
  goofy: {room_data: {}}
};

router.get('/', isLoggedIn, (req, res) => {
  res.render('lobby', {room_data, game_data});
});

module.exports = router;
